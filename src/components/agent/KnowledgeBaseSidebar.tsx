import React, { useState, useEffect } from 'react';
import { Plus, Info, Settings, ChevronDown, ChevronUp, X } from 'lucide-react';
import { CallSettings } from './CallSettings';
import { SpeechSettings } from './SpeechSettings';
import { Functions } from './Functions';
import { Dialog } from '../Dialog';
import { useAuth } from '../../hooks/useAuth';

interface KnowledgeBase {
  knowledge_base_id: string;
  knowledge_base_name: string;
  status: string;
  created_at: Date;
}

interface KnowledgeBaseSidebarProps {
  agentData: any;
  onUpdateAgent: (key: string, value: any) => void;
}

export function KnowledgeBaseSidebar({
  agentData,
  onUpdateAgent,
}: KnowledgeBaseSidebarProps) {
  const { user } = useAuth();
  const [isCallSettingsOpen, setIsCallSettingsOpen] = useState(false);
  const [isSpeechSettingsOpen, setIsSpeechSettingsOpen] = useState(false);
  const [isFunctionsOpen, setIsFunctionsOpen] = useState(false);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [allKnowledgeBases, setAllKnowledgeBases] = useState<KnowledgeBase[]>(
    []
  );
  const [connectedKnowledgeBases, setConnectedKnowledgeBases] = useState<
    KnowledgeBase[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await fetch(
          'https://backend-dig-agents-wannes.replit.app/api/list-knowledge-bases'
        );
        const data = await response.json();
        setAllKnowledgeBases(data);

        const connectedIds = agentData.llm_data.knowledge_base_ids || [];
        const connected = data.filter((kb: KnowledgeBase) =>
          connectedIds.includes(kb.knowledge_base_id)
        );
        setConnectedKnowledgeBases(connected);
      } catch (error) {
        console.error('Error fetching knowledge bases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgeBases();
  }, [user, agentData.llm_data.knowledge_base_ids]);

  const handleAddKnowledgeBase = async (knowledgeBaseId: string) => {
    const currentIds = agentData.llm_data.knowledge_base_ids || [];
    if (currentIds.includes(knowledgeBaseId)) return;

    const newIds = [...currentIds, knowledgeBaseId];

    try {
      await onUpdateAgent('knowledge_base_ids', newIds);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding knowledge base:', error);
    }
  };

  const handleRemoveKnowledgeBase = async (knowledgeBaseId: string) => {
    const currentIds = agentData.llm_data.knowledge_base_ids || [];
    const newIds = currentIds.filter((id) => id !== knowledgeBaseId);

    try {
      await onUpdateAgent('knowledge_base_ids', newIds);
    } catch (error) {
      console.error('Error removing knowledge base:', error);
    }
  };

  const getUnconnectedKnowledgeBases = () => {
    const connectedIds = agentData.llm_data.knowledge_base_ids || [];
    return allKnowledgeBases.filter(
      (kb) => !connectedIds.includes(kb.knowledge_base_id)
    );
  };

  return (
    <div className="w-60 border-l border-gray-200 bg-white overflow-auto">
      <div className="border-b border-gray-200">
        <button
          className="w-full p-4 text-left hover:bg-gray-50"
          onClick={() => setIsKnowledgeBaseOpen(!isKnowledgeBaseOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings size={16} />
              <span>Knowledge base</span>
            </div>
            {isKnowledgeBaseOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
        </button>
        {isKnowledgeBaseOpen && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <Info size={16} />
                </button>
                <p className="text-sm text-gray-500">
                  Add context to the agent
                </p>
              </div>
              <button
                onClick={() => setIsAddDialogOpen(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-2">
              {loading ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : connectedKnowledgeBases.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No knowledge bases connected
                </div>
              ) : (
                connectedKnowledgeBases.map((kb) => (
                  <div
                    key={kb.knowledge_base_id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
                  >
                    <span className="truncate flex-1">
                      {kb.knowledge_base_name}
                    </span>
                    <button
                      onClick={() =>
                        handleRemoveKnowledgeBase(kb.knowledge_base_id)
                      }
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200">
        <button
          className="w-full p-4 text-left hover:bg-gray-50"
          onClick={() => setIsFunctionsOpen(!isFunctionsOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings size={16} />
              <span>Functions</span>
            </div>
            {isFunctionsOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
        </button>
        {isFunctionsOpen && (
          <Functions
            tools={agentData.llm_data?.general_tools || []}
            onUpdate={(tools) => onUpdateAgent('general_tools', tools)}
          />
        )}
      </div>

      <div className="border-t border-gray-200">
        <button
          className="w-full p-4 text-left hover:bg-gray-50"
          onClick={() => setIsSpeechSettingsOpen(!isSpeechSettingsOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings size={16} />
              <span>Speech settings</span>
            </div>
            {isSpeechSettingsOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
        </button>
        {isSpeechSettingsOpen && (
          <SpeechSettings
            ambientSound={agentData.ambient_sound}
            responsiveness={agentData.responsiveness}
            interruptionSensitivity={agentData.interruption_sensitivity}
            enableBackchannel={agentData.enable_backchannel}
            backchannelWords={agentData.backchannel_words}
            pronunciationDictionary={agentData.pronunciation_dictionary}
            onUpdate={onUpdateAgent}
          />
        )}
      </div>

      <div className="border-t border-gray-200">
        <button
          className="w-full p-4 text-left hover:bg-gray-50"
          onClick={() => setIsCallSettingsOpen(!isCallSettingsOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings size={16} />
              <span>Call settings</span>
            </div>
            {isCallSettingsOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
        </button>
        {isCallSettingsOpen && (
          <CallSettings
            voicemailDetection={agentData.enable_voicemail_detection}
            endCallAfterSilence={agentData.end_call_after_silence_ms}
            maxCallDuration={agentData.max_call_duration_ms}
            beginMessageDelay={agentData.begin_message_delay_ms}
            onUpdate={onUpdateAgent}
          />
        )}
      </div>

      <Dialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Add Knowledge Base"
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Select a knowledge base to connect to this agent
          </div>

          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getUnconnectedKnowledgeBases().map((kb) => (
                <button
                  key={kb.knowledge_base_id}
                  onClick={() => handleAddKnowledgeBase(kb.knowledge_base_id)}
                  className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="font-medium text-sm">
                    {kb.knowledge_base_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    Status: {kb.status}
                  </div>
                </button>
              ))}
              {getUnconnectedKnowledgeBases().length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No available knowledge bases to connect
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setIsAddDialogOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
