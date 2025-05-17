import Link from 'next/link';

export default function Home() {
  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="display-4 mb-4">競馬レース記事生成システム</h1>
          <p className="lead mb-4">
            レース名を入力するだけで、AIが自動的に最新情報を収集・分析し、予想記事を生成します。
            出走馬情報、オッズ、馬場状態、天気予報などを自動取得し、印と買い目を提案します。
          </p>
          
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center mb-5">
            <Link href="/login" className="btn btn-primary btn-lg px-4 gap-3">
              ログイン
            </Link>
            <Link href="/register" className="btn btn-outline-secondary btn-lg px-4">
              新規登録
            </Link>
          </div>
          
          <div className="row g-4 py-5">
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">最新情報を自動収集</h5>
                  <p className="card-text">
                    出走馬情報、オッズ、馬場状態、天気予報などの最新情報を自動的に収集します。
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">AI独自の分析</h5>
                  <p className="card-text">
                    収集したデータを基に、独自のAI分析を実施し、各馬の勝率を計算します。
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">完全自動化</h5>
                  <p className="card-text">
                    レース名を入力するだけで、すべての分析と記事生成を自動的に行います。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
