export default function CortePage() {
  return (
    <main style={{minHeight:'100vh', background:'#000', color:'#fff', padding:'20px'}}>
      <h1 style={{fontSize:'22px', fontWeight:'bold', marginBottom:'10px'}}>
        ⚖️ Corte Constitucional de Colomzuela
      </h1>
      <p style={{marginBottom:'12px', lineHeight:'1.4'}}>
        <b>Art.6:</b> 7 Jueces, 9 años, modelo Kelsen. Cualquier ciudadano puede impugnar ley inconstitucional.
      </p>

      {/* ESTE ES EL QUE ESTABA EN BLANCO - YA ARREGLADO CON LETRA NEGRA */}
      <div style={{background:'#fef3c7', color:'#111', padding:'14px', borderRadius:'12px', marginBottom:'20px', fontWeight:'bold', border:'1px solid #f59e0b'}}>
        Sede: Guajira - Neutral, como Luxemburgo UE
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
        {[1,2,3,4,5,6,7].map(i => (
          <div key={i} style={{background:'#111', border:'1px solid #333', borderRadius:'12px', padding:'16px', textAlign:'center'}}>
            <div style={{fontSize:'28px'}}>👩‍⚖️</div>
            <div style={{fontWeight:'bold', margin:'6px 0'}}>Juez {i}</div>
            <div style={{fontSize:'12px', opacity:0.8}}>Por elegir - 9 años</div>
            <div style={{fontSize:'12px', opacity:0.5, marginTop:'4px'}}>Guardián Constitución</div>
          </div>
        ))}
      </div>

      <a href="/" style={{display:'block', marginTop:'24px', textAlign:'center', color:'#f59e0b', textDecoration:'none'}}>
        ← Volver a la República
      </a>
    </main>
  )
}
