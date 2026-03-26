import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from "react-signature-canvas";
import { FileText, Upload, Download, Trash2, Share2 } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const key = "nexus_documents";

interface DocumentItem {
  status: "Draft" | "In Review" | "Signed";
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  url?: string;
  signature?: string;
}

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const storedDocs = localStorage.getItem("nexus_documents");
    return storedDocs ? JSON.parse(storedDocs) : [];
  });
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const sigPad = useRef<SignatureCanvas>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    const newDoc: DocumentItem = {
      id: Date.now(),
      name: file.name,
      type: file.type || "File",
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      lastModified: new Date().toISOString().slice(0, 10),
      shared: false,
      url: URL.createObjectURL(file),
      status: "Draft"
    };

    setDocuments([...documents, newDoc]);
  };

  // ///// clearSignature 
  const clearSignature = () => sigPad.current?.clear();

  // //// handleDownload
  const handleDownload = (doc: DocumentItem) => {
    if (!doc.url) return;
    const link = document.createElement("a");
    link.href = doc.url;
    link.download = doc.name;
    link.click();
  };

  // /////// toggleShare
  const toggleShare = (id: number) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === id ? { ...doc, shared: !doc.shared } : doc
      )
    );
  };

  // //////// handleDelete
  const handleDelete = (id: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  // /////// updateStatus
  const updateStatus = (id: number, status: DocumentItem["status"]) => {
    setDocuments(prev =>
      prev.map(doc => doc.id === id ? { ...doc, status } : doc)
    );
  };

  // /// statusColor
  const statusColor = (status: DocumentItem["status"]) => {
    switch (status) {
      case "Draft": return "yellow";
      case "In Review": return "blue";
      case "Signed": return "secondary";
      default: return "gray";
    }
  };

  // // useEffect
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    if (sigPad.current) {
      sigPad.current.clear();
    }
  }, [selectedDoc]);

  return (
    <div className="space-y-6 animate-fade-in py-6">

      {/* Upload */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">Manage your startup's important files</p>
        </div>

        <div className="flex flex-col">
          <Button
            leftIcon={<Upload size={18} />}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Document
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Storage info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Storage</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Used</span>
                <span className="font-medium text-gray-900">12.5 GB</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-primary-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available</span>
                <span className="font-medium text-gray-900">7.5 GB</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Access</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Recent Files
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Shared with Me
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Starred
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  Trash
                </button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Document List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">All Documents</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Sort by
                </Button>
                <Button variant="outline" size="sm">
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {documents.length === 0 && <p>No documents uploaded</p>}
              <div className="space-y-2">
                {documents.map(doc => (
                  <div
                    key={doc.id}
                    className="flex flex-col md:flex-row md:items-center p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200 gap-3"
                  >
                    <div className="p-2 bg-primary-50 rounded-lg mr-4">
                      <FileText size={24} className="text-primary-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h3>
                        {doc.shared && <Badge variant="secondary" size="sm">Shared</Badge>}
                        <Badge
                          size="sm"
                          className={`bg-${statusColor(doc.status)}-100 text-${statusColor(doc.status)}-800`}
                        >
                          {doc.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{doc.type}</span>
                        <span>{doc.size}</span>
                        <span>Modified {doc.lastModified}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 md:ml-4 flex-wrap">

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDoc(doc);
                          updateStatus(doc.id, "In Review");
                        }}
                      >
                        Preview
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download size={18} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleShare(doc.id)}
                      >
                        <Share2 size={18} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-error-600 hover:text-error-700"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 size={18} />
                      </Button>

                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Signature */}
      {selectedDoc && (
        <div className="mt-8 bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Document Preview</h2>
          <iframe src={selectedDoc.url} className="w-full h-80 border mb-4" title="preview" />
          <p className="font-medium mb-2">E-Signature</p>
          <SignatureCanvas
            ref={sigPad}
            penColor="black"
            canvasProps={{ width: 500, height: 150, className: "border w-full max-w-[500px]" }}
          />
          <button
            onClick={clearSignature}
            className="mt-3 px-4 py-1.5 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
          >
            Clear Signature
          </button>

          <button
            onClick={() => {
              if (selectedDoc) {
                updateStatus(selectedDoc.id, "Signed")
              }
            }}
            className="mt-3 ml-3 px-4 py-1.5 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
          >
            Sign Document
          </button>

        </div>
      )}

    </div>
  );
};