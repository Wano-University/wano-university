import { QRCodeSVG } from 'qrcode.react';
import { QrCode } from 'lucide-react';

export default function QRCodeDisplay({ url, title = "Scan to Validate" }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-6 text-foreground">
        <QrCode className="w-5 h-5" />
        <span className="font-bold text-sm tracking-tight">{title}</span>
      </div>

      <div className="p-4 bg-white rounded-2xl shadow-inner border border-muted">
        <QRCodeSVG
          value={url}
          size={200}
          level="H"
          includeMargin={false}
        />
      </div>
      <p className="text-[10px] text-muted-foreground mt-4 font-mono truncate max-w-[200px]">
        {url.split('//')[1]}
      </p>
    </div>
  );
}
