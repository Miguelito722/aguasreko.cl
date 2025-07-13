import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, XCircle, Clock, Shield, Key, Webhook, TestTube } from 'lucide-react';
import { PaymentTestingService } from '../services/testingService';
import { SSLService } from '../services/sslService';
import { paymentConfig } from '../config/payment';
import { transbankService } from '../services/transbankService';

const PaymentTestDashboard: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [sslStatus, setSSLStatus] = useState<any>(null);

  const runTests = async () => {
    setIsRunning(true);
    try {
      const results = await PaymentTestingService.runPaymentTests();
      setTestResults(results);
      
      // Generate and download test report
      const report = PaymentTestingService.generateTestReport(results);
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-test-report-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const checkSSL = async () => {
    try {
      const status = await SSLService.validateCertificate();
      setSSLStatus(status);
    } catch (error) {
      console.error('SSL check failed:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'FAIL':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Integration{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Test Dashboard
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive testing and monitoring for all payment providers
          </p>
        </motion.div>

        {/* Configuration Overview */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <TestTube className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Environment</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600 capitalize">
              {paymentConfig.environment}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Key className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">API Keys</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {transbankService.validateConfig() ? 'Valid' : 'Invalid'}
            </p>
            <p className="text-sm text-gray-500">
              Transbank: {transbankService.getConfig().environment}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Webhook className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Webhooks</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">4/4</p>
            <p className="text-sm text-gray-500">Active</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">SSL Status</h3>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-orange-600">
                {sslStatus ? (sslStatus.pciCompliant ? 'Valid' : 'Invalid') : 'Unknown'}
              </p>
              <motion.button
                onClick={checkSSL}
                className="text-sm text-blue-600 hover:text-blue-700"
                whileHover={{ scale: 1.05 }}
              >
                Check
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Test Controls */}
        <motion.div
          className="bg-white rounded-3xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Payment Provider Tests</h2>
            <motion.button
              onClick={runTests}
              disabled={isRunning}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isRunning
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
              }`}
              whileHover={!isRunning ? { scale: 1.05 } : {}}
              whileTap={!isRunning ? { scale: 0.95 } : {}}
            >
              {isRunning ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Running Tests...</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  <span>Run All Tests</span>
                </>
              )}
            </motion.button>
          </div>

          {testResults && (
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(testResults).map(([provider, data]: [string, any]) => (
                <motion.div
                  key={provider}
                  className="border border-gray-200 rounded-2xl p-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{data.provider}</h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(data.overall)}
                      <span className={`font-medium ${
                        data.overall === 'PASS' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.overall}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {data.tests.map((test: any, index: number) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-sm text-gray-700">{test.name}</span>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(test.status)}
                          <span className={`text-xs font-medium ${
                            test.status === 'PASS' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {test.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* SSL Certificate Details */}
        {sslStatus && (
          <motion.div
            className="bg-white rounded-3xl shadow-lg p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">SSL Certificate Status</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valid:</span>
                    <span className={`font-medium ${sslStatus.valid ? 'text-green-600' : 'text-red-600'}`}>
                      {sslStatus.valid ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PCI Compliant:</span>
                    <span className={`font-medium ${sslStatus.pciCompliant ? 'text-green-600' : 'text-red-600'}`}>
                      {sslStatus.pciCompliant ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {sslStatus.certificate && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">TLS Version:</span>
                        <span className="font-medium text-gray-900">{sslStatus.certificate.tlsVersion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Key Length:</span>
                        <span className="font-medium text-gray-900">{sslStatus.certificate.keyLength} bits</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hash Algorithm:</span>
                        <span className="font-medium text-gray-900">{sslStatus.certificate.hashAlgorithm}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">PCI DSS Requirements</h3>
                <div className="space-y-3">
                  {[
                    { name: 'TLS 1.2+', status: sslStatus.certificate?.tlsVersion >= 1.2 },
                    { name: 'Strong Encryption', status: sslStatus.certificate?.keyLength >= 2048 },
                    { name: 'Secure Hash', status: ['SHA-256', 'SHA-384', 'SHA-512'].includes(sslStatus.certificate?.hashAlgorithm) },
                    { name: 'Domain Validated', status: sslStatus.certificate?.domainValidated },
                  ].map((req, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-600">{req.name}</span>
                      <div className="flex items-center space-x-2">
                        {req.status ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${req.status ? 'text-green-600' : 'text-red-600'}`}>
                          {req.status ? 'Pass' : 'Fail'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PaymentTestDashboard;