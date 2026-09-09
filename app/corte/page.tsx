export default function CortePage() {
  return (
    <div style={{padding:'20px', fontFamily:'sans-serif'}}>
      <h1>⚖️ Corte Constitucional de Colomzuela</h1>
      <p><b>Art.6:</b> 7 Jueces, 9 años, modelo Kelsen. Cualquier ciudadano puede impugnar ley inconstitucional.</p>
      <p style={{background:'#fef3c7', padding:10, borderRadius:8}}>Sede: Guajira - Neutral, como Luxemburgo UE.</p>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:'12px', marginTop:20}}>
        {Array.from({length:7}).map((_,i)=>(
          <div key={i} style={{border:'2px solid #111', padding:'16px', borderRadius:'12px', textAlign:'center'}}>
            <div style={{fontSize:'30px'}}>👩‍⚖️</div>
            <b>Juez {i+1}</b><br/>
            <small>Por elegir - 9 años</small><br/>
            <small style={{color:'#666'}}>Guardián Constitución</small>
          </div>
        ))}
      </div>
      <div style={{marginTop:20}}>
        <button disabled>IMPUGNAR LEY (Art.6)</button>
      </div>
    </div>
  )
}
