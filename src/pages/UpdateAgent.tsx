import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RetellWebClient } from 'retell-client-js-sdk';
import { VoiceLanguageSelector } from '../components/agent/VoiceLanguageSelector';
import { WelcomeMessage } from '../components/agent/WelcomeMessage';
import { PromptEditor } from '../components/agent/PromptEditor';
import { KnowledgeBaseSidebar } from '../components/agent/KnowledgeBaseSidebar';
import { TestCallSidebar } from '../components/agent/TestCallSidebar';
import { Edit2 } from 'lucide-react';

interface Voice {
  voice_id: string;
  voice_name: string;
  provider: string;
  accent: string;
  gender: string;
  age: string;
  preview_audio_url: string;
}

interface AgentData {
  agent_id: string;
  agent_name?: string;
  voice_id: string;
  language: string;
  llm_data: {
    llm_id: string;
    general_prompt: string;
    begin_message: string;
    general_tools: Array<{
      name: string;
      type: string;
      description: string;
      url?: string;
      timeout_ms?: number;
      number?: string;
      speak_during_execution: boolean;
      speak_after_execution: boolean;
    }>;
  };
  enable_voicemail_detection?: boolean;
  end_call_after_silence_ms?: number;
  max_call_duration_ms?: number;
  begin_message_delay_ms?: number;
  ambient_sound?: string;
  responsiveness?: number;
  interruption_sensitivity?: number;
  enable_backchannel?: boolean;
  backchannel_words?: string[];
  pronunciation_dictionary?: Array<{
    word: string;
    alphabet: string;
    phoneme: string;
  }>;
}

export function UpdateAgent() {
  const { agentId } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [agentData, setAgentData] = useState<AgentData | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempAgentName, setTempAgentName] = useState('');
  const webClientRef = useRef<RetellWebClient | null>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // Function to determine if a field belongs to LLM data
  const isLLMField = (key: string) => {
    return ['general_prompt', 'general_tools', 'begin_message'].includes(key);
  };

  // Function to update LLM data
  const updateLLM = async (llmData: any) => {
    if (!user || !agentData?.llm_data?.llm_id) return;

    try {
      const response = await fetch(
        'https://backend-dig-agents-wannes.replit.app/api/update-llm',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.uid,
            workspace_id: '1',
            llm_data: {
              llm_id: agentData.llm_data.llm_id,
              ...llmData,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update LLM');
      }
    } catch (error) {
      console.error('Error updating LLM:', error);
      throw error;
    }
  };

  // Function to update Agent data
  const updateAgent = async (agentDataToUpdate: any) => {
    if (!user || !agentId) return;

    try {
      const response = await fetch(
        'https://backend-dig-agents-wannes.replit.app/api/update-agent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.uid,
            workspace_id: '1',
            agent_data: {
              agent_id: agentId,
              ...agentDataToUpdate,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update agent');
      }
    } catch (error) {
      console.error('Error updating agent:', error);
      throw error;
    }
  };

const handleUpdateAgent = async (key: string, value: any) => {
  if (!agentData) return;

  // Clear any existing timeout
  if (updateTimeoutRef.current) {
    clearTimeout(updateTimeoutRef.current);
  }

  // Update local state immediately
  let newAgentData: AgentData;
  if (key === 'general_tools' || key === 'knowledge_base_ids') {
    newAgentData = {
      ...agentData,
      llm_data: {
        ...agentData.llm_data,
        [key]: value,
      },
    };
  } else if (isLLMField(key) || key === 'begin_message') {
    newAgentData = {
      ...agentData,
      llm_data: {
        ...agentData.llm_data,
        [key]: value,
      },
    };
  } else {
    newAgentData = {
      ...agentData,
      [key]: value,
    };
  }
  setAgentData(newAgentData);

  // Debounce the API call
  updateTimeoutRef.current = setTimeout(async () => {
    try {
      if (isLLMField(key) || key === 'begin_message' || key === 'knowledge_base_ids') {
        // Update LLM data
        await updateLLM({
          ...agentData.llm_data,
          [key]: value,
        });
      } else {
        // Update Agent data
        const agentUpdateData =
          key === 'general_tools'
            ? { llm_data: { general_tools: value } }
            : { ...agentData, [key]: value };
        await updateAgent(agentUpdateData);
      }
    } catch (error) {
      // Revert local state on error
      setAgentData(agentData);
      console.error('Failed to update:', error);
    }
  }, 500);
};
  

  const handleNameEdit = () => {
    setTempAgentName(agentData?.agent_name || '');
    setIsEditingName(true);
  };

  const handleNameSave = async () => {
    if (!agentData) return;

    try {
      await handleUpdateAgent('agent_name', tempAgentName);
      setIsEditingName(false);
    } catch (error) {
      console.error('Error updating agent name:', error);
    }
  };

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch(
          'https://backend-dig-agents-wannes.replit.app/api/list-voices'
        );
        const data = await response.json();
        if (data.success) {
          setVoices(data.voices);
        }
      } catch (error) {
        console.error('Error fetching voices:', error);
      }
    };

    fetchVoices();

    // Cleanup function to clear any pending timeouts
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchAgentData = async () => {
      if (!user || !agentId) return;

      setLoading(true);
      try {
        const response = await fetch(
          `https://backend-dig-agents-wannes.replit.app/api/get-agent?agent_id=${agentId}`
        );
        const data = await response.json();

        if (data.success) {
          setAgentData(data.agent);
        } else {
          throw new Error(data.error || 'Failed to fetch agent data');
        }
      } catch (error) {
        console.error('Error fetching agent:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [agentId, user]);

  const handleToggleCall = async () => {
    if (isCallActive && webClientRef.current) {
      await webClientRef.current.stopCall();
      webClientRef.current = null;
      setIsCallActive(false);
      return;
    }

    if (!agentId) return;

    try {
      const response = await fetch(
        'https://backend-dig-agents-wannes.replit.app/api/start-web-call',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ agent_id: agentId }),
        }
      );

      const { accessToken } = await response.json();

      webClientRef.current = new RetellWebClient();

      await webClientRef.current.startCall({
        accessToken,
        captureDeviceId: 'default',
        playbackDeviceId: 'default',
        sampleRate: 16000,
      });

      setIsCallActive(true);
    } catch (error) {
      console.error('Error with test call:', error);
      setIsCallActive(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (!agentData) {
    return (
      <div className="flex items-center justify-center h-full">
        Agent not found
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto py-6 px-4">
          {/* Agent Name */}
          <div className="flex items-center space-x-2 mb-6">
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tempAgentName}
                  onChange={(e) => setTempAgentName(e.target.value)}
                  className="text-2xl font-semibold px-2 py-1 border rounded"
                  placeholder="Enter agent name"
                  autoFocus
                />
                <button
                  onClick={handleNameSave}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingName(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-semibold">
                  {agentData.agent_name || 'Single Prompt Agent'}
                </h1>
                <button
                  onClick={handleNameEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit2 size={16} />
                </button>
              </>
            )}
          </div>

          <VoiceLanguageSelector
            voices={voices}
            selectedVoiceId={agentData.voice_id}
            selectedLanguage={agentData.language}
            onVoiceChange={(voiceId) => handleUpdateAgent('voice_id', voiceId)}
            onLanguageChange={(language) =>
              handleUpdateAgent('language', language)
            }
          />

          <WelcomeMessage
            message={agentData.llm_data.begin_message}
            onChange={(message) => handleUpdateAgent('begin_message', message)}
          />

          <PromptEditor
            prompt={agentData.llm_data.general_prompt}
            onChange={(prompt) => handleUpdateAgent('general_prompt', prompt)}
          />
        </div>
      </div>

      <KnowledgeBaseSidebar
        agentData={agentData}
        onUpdateAgent={handleUpdateAgent}
      />
      <TestCallSidebar
        isCallActive={isCallActive}
        onToggleCall={handleToggleCall}
      />
    </div>
  );
}
