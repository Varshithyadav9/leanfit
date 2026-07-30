import { Link } from "react-router-dom";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header style={{padding:"20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h1 style={{fontSize:"2rem",fontWeight:"bold",color:"#16a34a"}}>LeanFit</h1>
      </header>

      <main style={{maxWidth:"900px",margin:"0 auto",padding:"40px 20px",textAlign:"center"}}>
        <h2 style={{fontSize:"2.5rem",fontWeight:"bold"}}>
          AI Diet & Workout Planner
        </h2>

        <p style={{marginTop:"20px",fontSize:"1.1rem",color:"#555"}}>
          Generate a personalized diet and workout plan in just a few minutes.
        </p>

        <div style={{marginTop:"30px"}}>
          <Link to="/generate">
            <button style={{padding:"14px 28px",margin:"10px"}}>Get My Plan</button>
          </Link>

          <Link to="/login">
            <button style={{padding:"14px 28px",margin:"10px"}}>Customer Login</button>
          </Link>

          <Link to="/admin-login">
            <button style={{padding:"14px 28px",margin:"10px"}}>Admin Login</button>
          </Link>
        </div>

        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
          gap:"20px",
          marginTop:"60px"
        }}>
          <div style={{padding:"20px",border:"1px solid #ddd",borderRadius:"10px"}}>
            <h3>🥗 Diet Plan</h3>
            <p>Personalized meals based on your goal.</p>
          </div>

          <div style={{padding:"20px",border:"1px solid #ddd",borderRadius:"10px"}}>
            <h3>🏋️ Workout Plan</h3>
            <p>Training routine designed for you.</p>
          </div>

          <div style={{padding:"20px",border:"1px solid #ddd",borderRadius:"10px"}}>
            <h3>🤖 AI Powered</h3>
            <p>Instant plans generated using AI.</p>
          </div>
        </div>
      </main>

      <footer style={{textAlign:"center",padding:"30px",color:"#777"}}>
        © 2026 LeanFit. All Rights Reserved.
      </footer>
    </div>
  );
}
