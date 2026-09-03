export default function Gallery({ images }){
  return (
    <div className="gallery">
      {images.map((it,idx)=> (
        <figure className="figure" key={idx}>
          <img src={'/images/'+it.file} alt={it.file} />
          <figcaption className="caption" contentEditable suppressContentEditableWarning>{it.caption||'Click to add caption...'}</figcaption>
        </figure>
      ))}
    </div>
  )
}
