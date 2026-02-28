import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Copy, Sparkles } from 'lucide-react';

const MeetingUpload = () => {
  const navigate = useNavigate();
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'paste'
  const [meetingTitle, setMeetingTitle] = useState('');
  const [pastedContent, setPastedContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleProcess = () => {
    setProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setProcessing(false);
      navigate('/dashboard/meetings');
    }, 2500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/meetings')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Add New Meeting
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Upload a transcript or paste meeting notes to create AI-powered knowledge
          </p>
        </div>
      </div>

      {/* Upload Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setUploadMethod('file')}
          className={`p-6 rounded-2xl border-2 transition ${
            uploadMethod === 'file'
              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-gray-300 dark:hover:border-zinc-600'
          }`}
        >
          <Upload className={`w-8 h-8 mb-3 ${uploadMethod === 'file' ? 'text-indigo-600' : 'text-gray-400'}`} />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Upload Transcript</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Upload a .txt, .docx, or .pdf file
          </p>
        </button>

        <button
          onClick={() => setUploadMethod('paste')}
          className={`p-6 rounded-2xl border-2 transition ${
            uploadMethod === 'paste'
              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-gray-300 dark:hover:border-zinc-600'
          }`}
        >
          <Copy className={`w-8 h-8 mb-3 ${uploadMethod === 'paste' ? 'text-indigo-600' : 'text-gray-400'}`} />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Paste Notes</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Copy and paste meeting notes directly
          </p>
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-gray-100 dark:border-zinc-700">
        {/* Meeting Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Meeting Title
          </label>
          <input
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="e.g., Q1 Strategy Planning"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Upload/Paste Area */}
        {uploadMethod === 'file' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload File
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-lg p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".txt,.docx,.pdf"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Click to upload
              </label>
              <span className="text-gray-500 dark:text-gray-400"> or drag and drop</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                TXT, DOCX, or PDF (max 10MB)
              </p>
              {selectedFile && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-3">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meeting Notes or Transcript
            </label>
            <textarea
              value={pastedContent}
              onChange={(e) => setPastedContent(e.target.value)}
              placeholder="Paste your meeting notes, transcript, or key points here..."
              rows={12}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
            />
          </div>
        )}

        {/* AI Features Info */}
        <div className="mt-6 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                AI will automatically generate:
              </p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 mt-2 space-y-1">
                <li>• Structured summary with key points</li>
                <li>• Decisions made and their context</li>
                <li>• Action items with owners and deadlines</li>
                <li>• Searchable knowledge base entries</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => navigate('/dashboard/meetings')}
            className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleProcess}
            disabled={processing || (!selectedFile && !pastedContent) || !meetingTitle}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {processing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Process with AI
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingUpload;