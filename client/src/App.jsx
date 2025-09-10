import React, { useState, useEffect } from 'react'

const API_BASE = "http://localhost:8000"

function App() {
  const [image, setImage] = useState(null)
  const [top, setTop] = useState('One does not simply')
  const [bottom, setBottom] = useState('Ship to production without Docker')
  const [loading, setLoading] = useState(false)
  const [resultUrl, setResultUrl] = useState('')
  const [theme, setTheme] = useState("dark") // 👈 start in dark mode

  // Apply theme to <html> tag
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!image) return alert('Pick an image')
    setLoading(true)
    setResultUrl('')
    try {
      const fd = new FormData()
      fd.append('image', image)
      fd.append('top_text', top)
      fd.append('bottom_text', bottom)

      const r = await fetch(`${API_BASE}/api/meme`, { method: 'POST', body: fd })
      if (!r.ok) throw new Error('Failed to generate')

      const blob = await r.blob()
      setResultUrl(URL.createObjectURL(blob))
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const download = () => {
    const a = document.createElement('a')
    a.href = resultUrl
    a.download = 'meme.png'
    a.click()
  }

  return (
    <div className="container">
      <div className="card">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>

        <h1>🖼️ Meme Generator</h1>
        <p>Create classic top/bottom-text memes in seconds.</p>

        <form onSubmit={onSubmit}>
          <div>
            <label>Image</label>
            <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
          </div>

          <div className="row">
            <div>
              <label>Top text</label>
              <input value={top} onChange={e => setTop(e.target.value)} placeholder="TOP TEXT" />
            </div>
            <div>
              <label>Bottom text</label>
              <input value={bottom} onChange={e => setBottom(e.target.value)} placeholder="BOTTOM TEXT" />
            </div>
          </div>

          <button disabled={loading}>
            {loading ? 'Generating…' : 'Generate Meme'}
          </button>
        </form>

        {resultUrl && (
          <div className="preview">
            <img src={resultUrl} alt="meme" />
            <button onClick={download} style={{ marginTop: 12 }}>Download PNG</button>
          </div>
        )}

        <div className="footer">API: {API_BASE}</div>
      </div>
    </div>
  )
}

export default App
