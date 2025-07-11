import QRCode from 'qrcode';

const testQRGeneration = async () => {
  try {
    const productCode = 'BC12345';
    const baseUrl = 'http://192.168.1.36:8080';
    const productUrl = `${baseUrl}/status/${productCode}`;
    
    console.log('Generated URL:', productUrl);
    
    const qrDataUrl = await QRCode.toDataURL(productUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    console.log('QR Code generated successfully!');
    console.log('URL length:', productUrl.length);
    console.log('QR data URL length:', qrDataUrl.length);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testQRGeneration(); 