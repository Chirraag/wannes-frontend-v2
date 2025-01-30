import React, { useState } from 'react';
import { Phone, Clock, Plus, Edit, Trash2, X } from 'lucide-react';
import { Dialog } from '../Dialog';
import { Switch } from '../ui/Switch';

interface FunctionTool {
  name: string;
  type: string;
  description: string;
  url?: string;
  timeout_ms?: number;
  number?: string;
  speak_during_execution: boolean;
  speak_after_execution: boolean;
  parameters?: Record<string, any>;
}

interface FunctionsProps {
  tools: FunctionTool[];
  onUpdate: (tools: FunctionTool[]) => void;
}

export function Functions({ tools = [], onUpdate }: FunctionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<FunctionTool | null>(null);
  const [newTool, setNewTool] = useState<FunctionTool>({
    name: '',
    type: 'custom',
    description: '',
    url: '',
    timeout_ms: 120000,
    speak_during_execution: false,
    speak_after_execution: false,
  });

  const handleOpenDialog = (tool?: FunctionTool) => {
    if (tool) {
      setEditingTool(tool);
      setNewTool(tool);
    } else {
      setEditingTool(null);
      setNewTool({
        name: '',
        type: 'custom',
        description: '',
        url: '',
        timeout_ms: 120000,
        speak_during_execution: false,
        speak_after_execution: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingTool) {
      const updatedTools = tools.map((t) =>
        t.name === editingTool.name ? newTool : t
      );
      onUpdate(updatedTools);
    } else {
      onUpdate([...tools, newTool]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (toolName: string) => {
    const updatedTools = tools.filter((t) => t.name !== toolName);
    onUpdate(updatedTools);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'end_call':
        return Phone;
      case 'transfer_call':
        return Phone;
      default:
        return Clock;
    }
  };

  return (
    <div className="border-t border-gray-200 py-4">
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Functions</h3>
          <button
            onClick={() => handleOpenDialog()}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Enable your agent with capabilities such as calendar bookings, call
          termination, etc.
        </p>

        <div className="space-y-2">
          {tools.map((tool) => {
            const Icon = getIconForType(tool.type);
            return (
              <div
                key={tool.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Icon size={18} className="text-gray-400" />
                  <div>
                    <span className="text-sm font-medium">{tool.name}</span>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {tool.speak_during_execution && (
                        <span className="mr-2">Speaks during</span>
                      )}
                      {tool.speak_after_execution && <span>Speaks after</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenDialog(tool)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(tool.name)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={`${editingTool ? 'Edit' : 'Add'} Function`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={newTool.name}
              onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter function name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={newTool.type}
              onChange={(e) => setNewTool({ ...newTool, type: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="custom">Custom Function</option>
              <option value="end_call">End Call</option>
              <option value="transfer_call">Transfer Call</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={newTool.description}
              onChange={(e) =>
                setNewTool({ ...newTool, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg h-24"
              placeholder="Enter function description"
            />
          </div>

          {newTool.type === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input
                  type="url"
                  value={newTool.url}
                  onChange={(e) =>
                    setNewTool({ ...newTool, url: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter function URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  API Timeout (milliseconds)
                </label>
                <input
                  type="number"
                  value={newTool.timeout_ms}
                  onChange={(e) =>
                    setNewTool({
                      ...newTool,
                      timeout_ms: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter timeout in milliseconds"
                />
              </div>
            </>
          )}

          {newTool.type === 'transfer_call' && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={newTool.number}
                onChange={(e) =>
                  setNewTool({ ...newTool, number: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter phone number"
              />
            </div>
          )}

          <div className="space-y-4 border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700">
              Speech Settings
            </h4>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Speak During Execution
                </label>
                <p className="text-xs text-gray-500">
                  Agent will speak while the function is being executed
                </p>
              </div>
              <Switch
                checked={newTool.speak_during_execution}
                onCheckedChange={(checked) =>
                  setNewTool({ ...newTool, speak_during_execution: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Speak After Execution
                </label>
                <p className="text-xs text-gray-500">
                  Agent will speak after the function has completed
                </p>
              </div>
              <Switch
                checked={newTool.speak_after_execution}
                onCheckedChange={(checked) =>
                  setNewTool({ ...newTool, speak_after_execution: checked })
                }
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              {editingTool ? 'Save Changes' : 'Add Function'}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
