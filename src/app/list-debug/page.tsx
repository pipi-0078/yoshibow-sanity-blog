import ListDebugComponent from '@/components/ListDebugComponent';

export default function ListDebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-bold text-center mb-8">リスト機能デバッグページ</h1>
        <ListDebugComponent />
      </div>
    </div>
  );
}