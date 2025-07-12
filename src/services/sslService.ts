// SSL Certificate Management and PCI DSS Compliance
export class SSLService {
  // Check SSL certificate validity
  static async validateCertificate(): Promise<{
    valid: boolean;
    certificate: any;
    pciCompliant: boolean;
  }> {
    try {
      const response = await fetch('/api/ssl/validate', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      return {
        valid: data.valid,
        certificate: data.certificate,
        pciCompliant: this.checkPCICompliance(data.certificate),
      };
    } catch (error) {
      console.error('SSL validation error:', error);
      return {
        valid: false,
        certificate: null,
        pciCompliant: false,
      };
    }
  }

  // Check PCI DSS compliance requirements
  private static checkPCICompliance(certificate: any): boolean {
    if (!certificate) return false;

    const requirements = {
      tlsVersion: certificate.tlsVersion >= 1.2,
      keyLength: certificate.keyLength >= 2048,
      hashAlgorithm: ['SHA-256', 'SHA-384', 'SHA-512'].includes(certificate.hashAlgorithm),
      validityPeriod: certificate.validityPeriod <= 365, // Max 1 year
      properDomainValidation: certificate.domainValidated,
      noWeakCiphers: !certificate.weakCiphers,
    };

    return Object.values(requirements).every(req => req === true);
  }

  // Generate CSR for certificate renewal
  static async generateCSR(domainInfo: {
    commonName: string;
    organization: string;
    organizationalUnit: string;
    city: string;
    state: string;
    country: string;
  }): Promise<string> {
    const response = await fetch('/api/ssl/generate-csr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(domainInfo),
    });

    const { csr } = await response.json();
    return csr;
  }

  // Monitor certificate expiration
  static async monitorCertificateExpiration(): Promise<{
    daysUntilExpiry: number;
    needsRenewal: boolean;
  }> {
    const response = await fetch('/api/ssl/expiration-check');
    const { expiryDate } = await response.json();
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      daysUntilExpiry,
      needsRenewal: daysUntilExpiry <= 30, // Renew 30 days before expiry
    };
  }
}