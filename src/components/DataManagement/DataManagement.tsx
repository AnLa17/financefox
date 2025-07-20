import { useState } from 'react';
import { Download, Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { LocalStorageService } from '../../services/localStorage';

interface DataManagementProps {
  onDataImported: () => void;
}

export const DataManagement = ({ onDataImported }: DataManagementProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    try {
      LocalStorageService.downloadDataAsFile();
    } catch (error) {
      console.error('Export fehler:', error);
      alert('Fehler beim Exportieren der Daten');
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const result = LocalStorageService.importAllData(text);
      setImportResult(result);
      
      if (result.success) {
        setTimeout(() => {
          setShowImportModal(false);
          setImportResult(null);
          onDataImported();
        }, 2000);
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Fehler beim Lesen der Datei'
      });
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  const handleTextImport = (jsonText: string) => {
    setIsImporting(true);
    setImportResult(null);

    try {
      const result = LocalStorageService.importAllData(jsonText);
      setImportResult(result);
      
      if (result.success) {
        setTimeout(() => {
          setShowImportModal(false);
          setImportResult(null);
          onDataImported();
        }, 2000);
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Fehler beim Verarbeiten der Daten'
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      {/* Button für den Header */}
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center px-3 py-2 border border-gray-600 rounded-md text-sm font-medium text-white bg-black hover:bg-gray-900 transition-colors duration-200"
      >
        <FileText className="w-4 h-4 mr-2 text-cyan-400" />
        Daten
      </button>

      {/* Modal für DataManagement */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Daten-Verwaltung</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-300 mb-6">
                Sichern Sie Ihre Haushaltsdaten oder übertragen Sie sie zwischen verschiedenen Geräten.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Export */}
                <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                  <div className="flex items-center mb-3">
                    <Download className="w-5 h-5 text-green-400 mr-2" />
                    <h3 className="font-semibold text-white">Daten exportieren</h3>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    Laden Sie alle Ihre Daten als JSON-Datei herunter.
                  </p>
                  <button
                    onClick={handleExport}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
                  >
                    <Download className="w-4 h-4 mr-2 inline" />
                    Exportieren
                  </button>
                </div>

                {/* Import */}
                <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                  <div className="flex items-center mb-3">
                    <Upload className="w-5 h-5 text-blue-400 mr-2" />
                    <h3 className="font-semibold text-white">Daten importieren</h3>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    Laden Sie eine JSON-Backup-Datei hoch.
                  </p>
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                  >
                    <Upload className="w-4 h-4 mr-2 inline" />
                    Importieren
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Daten importieren</h3>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportResult(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {importResult && (
                <div className={`mb-4 p-4 rounded-lg flex items-center ${
                  importResult.success 
                    ? 'bg-green-900 border border-green-600' 
                    : 'bg-red-900 border border-red-600'
                }`}>
                  {importResult.success ? (
                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
                  )}
                  <span className={importResult.success ? 'text-green-200' : 'text-red-200'}>
                    {importResult.message}
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    JSON-Datei auswählen
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    disabled={isImporting}
                    className="w-full text-sm text-gray-300 bg-gray-800 border border-gray-600 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
                  />
                </div>

                <div className="text-center text-gray-400">oder</div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    JSON-Text einfügen
                  </label>
                  <textarea
                    className="w-full h-32 px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none bg-gray-800 text-white placeholder-gray-400"
                    placeholder="JSON-Backup hier einfügen..."
                    onChange={(e) => {
                      if (e.target.value.trim()) {
                        handleTextImport(e.target.value);
                      }
                    }}
                    disabled={isImporting}
                  />
                </div>
              </div>

              {isImporting && (
                <div className="mt-4 flex items-center justify-center text-cyan-400">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-400 mr-2"></div>
                  Importiere Daten...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
