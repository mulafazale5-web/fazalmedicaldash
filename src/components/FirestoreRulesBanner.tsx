import React, { useState, useEffect } from 'react';
import { ShieldAlert, Copy, Check, ExternalLink, X, Database } from 'lucide-react';
import { onFirestorePermissionError } from '../lib/firebase';

const FIRESTORE_RULES_SNIPPET = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to manage their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow authenticated patients to create and manage their own appointments
    match /appointments/{appointmentId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}`;

export const FirestoreRulesBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsub = onFirestorePermissionError((errInfo) => {
      if (errInfo.error.includes('insufficient permissions') || errInfo.error.includes('permission-denied')) {
        setShowBanner(true);
      }
    });
    return unsub;
  }, []);

  if (!showBanner) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(FIRESTORE_RULES_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* Floating Pill Banner */}
      <div className="fixed bottom-4 right-4 z-50 max-w-md bg-white border border-amber-300 shadow-xl rounded-xl p-3.5 text-xs text-slate-800 flex items-start gap-3 animate-fade-in">
        <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg shrink-0">
          <Database className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-900">Firestore Rules Notice</p>
          <p className="text-slate-600 mt-0.5 text-[11px] leading-relaxed">
            Patient data and bookings are securely stored locally. To enable cloud sync in project <strong className="font-semibold text-slate-800">mgicarehospital</strong>, publish the security rules in Firebase Console.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => setShowModal(true)}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md text-[11px] transition-colors cursor-pointer"
            >
              View Firestore Rules
            </button>
            <a
              href="https://console.firebase.google.com/project/mgicarehospital/firestore/rules"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-800 hover:underline font-semibold text-[11px] flex items-center gap-1"
            >
              Open Console <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Rules Code Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Firestore Security Rules</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <p className="text-slate-600">
                Paste these rules into your Firebase Console at{' '}
                <a
                  href="https://console.firebase.google.com/project/mgicarehospital/firestore/rules"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-700 font-semibold underline"
                >
                  Firebase Console → Firestore Database → Rules
                </a>{' '}
                and click <strong>Publish</strong>:
              </p>

              <div className="relative">
                <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto max-h-56">
                  {FIRESTORE_RULES_SNIPPET}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] flex items-center gap-1 cursor-pointer border border-slate-700"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy Rules'}
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-1.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
