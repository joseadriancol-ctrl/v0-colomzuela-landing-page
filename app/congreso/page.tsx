export default function CongresoPage() {
  const regiones = ["Andina", "Caribe", "Llanos", "Orinoco", "Zulia-Táchira", "Guajira"];
  return (
    <div style={{padding: '20px', fontFamily: 'sans-serif'}}>
      <h1>🏛️ Congreso de Colomzuela - 75 Diputados</h1>
      <p><b>Art.5:</b> Unicameral, 4 años, representación proporcional. <i>Provisional hasta referendo Art.9</i></p>
      <p>6 Regiones: {regiones.join(" | ")}</p>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'12px', marginTop:20}}>
        {Array.from({length:75}).map((_,i)=>(
          <div key={i} style={{border:'1px solid #ddd', padding:'12px', borderRadius:'10px', background:'#fafafa'}}>
            <b>Silla {i+1}</b><br/>
            <small>{regiones[i % 6]}</small><br/>
            <small>Por elegir</small><br/>
            <button disabled style={{marginTop:8, width:'100%'}}>VOTAR (1000 ciudadanos)</button>
          </div>
        ))}
      </div>
    </div>
  )
}
