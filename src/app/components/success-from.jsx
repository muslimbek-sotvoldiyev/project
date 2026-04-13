"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function SuccessMessage() {
  const [screenSize, setScreenSize] = useState("desktop")

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      if (w < 640) setScreenSize("mobile")
      else if (w < 1024) setScreenSize("tablet")
      else setScreenSize("desktop")
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const fontStyle = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');
    * { box-sizing: border-box; }
  `

  const contacts = [
    { label: "Telefon", value: "+998 77 323 33 77", icon: (
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
    )},
    { label: "Manzil", value: "Buvayda tumani, Yangiqo'rg'on", icon: (
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
    )},
    { label: "Ish vaqti", value: "Du–Sha: 9:00 – 18:00", icon: (
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    )},
  ]

  if (screenSize === "mobile") {
    return (
      <div style={{minHeight:"100vh", background:"#F8F9FB", fontFamily:"'DM Sans', system-ui, sans-serif"}}>
        <style>{fontStyle}</style>

        {/* Top */}
        <div style={{background:"#0D1117", padding:"2.5rem 1.5rem 2rem", textAlign:"center", position:"relative", overflow:"hidden"}}>
          <div style={{
            position:"absolute", inset:0, opacity:0.025,
            backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize:"200px",
          }}/>

          <motion.div
            style={{
              width:"3.5rem", height:"3.5rem", borderRadius:"50%",
              border:"1px solid rgba(255,255,255,0.12)",
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 1.25rem", position:"relative", zIndex:1,
            }}
            initial={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}}
            transition={{type:"spring", stiffness:280, damping:22, delay:0.15}}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
            </svg>
          </motion.div>

          <motion.h1 style={{color:"#fff", fontSize:"1.5rem", fontWeight:"300", margin:"0 0 0.375rem", fontFamily:"'DM Serif Display', Georgia, serif", letterSpacing:"-0.02em", position:"relative", zIndex:1}}
            initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay:0.28}}>
            Yuborildi
          </motion.h1>
          <motion.p style={{color:"rgba(255,255,255,0.35)", fontSize:"0.8rem", margin:0, position:"relative", zIndex:1}}
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.38}}>
            So'rovingiz muvaffaqiyatli qabul qilindi
          </motion.p>
        </div>

        {/* Body */}
        <div style={{padding:"1.5rem"}}>
          <motion.div
            style={{background:"#fff", borderRadius:"1rem", padding:"1.25rem", border:"1px solid #E8EBF0", marginBottom:"1rem"}}
            initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{delay:0.45}}>
            <div style={{fontSize:"0.65rem", fontWeight:"600", color:"#9BA5B4", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem"}}>
              Oxford O'quv Markazi
            </div>
            <div style={{display:"flex", flexDirection:"column"}}>
              {contacts.map((item,i) => (
                <div key={i} style={{
                  display:"flex", alignItems:"center", gap:"0.75rem",
                  padding:"0.75rem 0",
                  borderBottom: i < contacts.length-1 ? "1px solid #F3F4F6" : "none",
                }}>
                  <div style={{color:"#9BA5B4", flexShrink:0}}>{item.icon}</div>
                  <div>
                    <div style={{fontSize:"0.62rem", color:"#BBC4D0", fontWeight:"500", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"0.1rem"}}>{item.label}</div>
                    <div style={{fontSize:"0.85rem", color:"#1A2332", fontWeight:"500"}}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.p style={{fontSize:"0.75rem", color:"#9BA5B4", textAlign:"center", lineHeight:1.6, marginBottom:"1.25rem"}}
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.55}}>
            Tez orada mutaxassislarimiz siz bilan bog'lanishadi
          </motion.p>

          <div style={{display:"flex", flexDirection:"column", gap:"0.625rem"}}>
            <motion.a href="https://maps.app.goo.gl/t46samrMYZh97fk16" target="_blank" rel="noopener noreferrer"
              style={{
                display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
                padding:"0.875rem", borderRadius:"0.75rem",
                background:"#0D1117", color:"#fff",
                fontWeight:"500", fontSize:"0.875rem", textDecoration:"none",
              }}
              initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay:0.6}}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
              Manzilni ko'rish
            </motion.a>
            <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay:0.66}}>
              <Link href="/" style={{
                display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
                padding:"0.875rem", borderRadius:"0.75rem",
                border:"1px solid #E2E6EC", color:"#6B7280",
                fontWeight:"500", fontSize:"0.875rem", textDecoration:"none",
                background:"#fff",
              }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
                Bosh sahifa
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const isTablet = screenSize === "tablet"

  return (
    <div style={{
      minHeight:"100vh", background:"#F8F9FB",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding: isTablet ? "1.5rem" : "2rem",
      fontFamily:"'DM Sans', system-ui, sans-serif",
    }}>
      <style>{fontStyle}</style>

      <motion.div style={{
        width:"100%", maxWidth: isTablet ? "40rem" : "52rem",
        background:"#fff", borderRadius:"1.5rem",
        overflow:"hidden", display:"flex",
        flexDirection: isTablet ? "column" : "row",
        border:"1px solid #E8EBF0",
        boxShadow:"0 1px 3px rgba(0,0,0,0.04), 0 12px 48px rgba(0,0,0,0.06)",
      }}
        initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{duration:0.5, ease:[0.22,1,0.36,1]}}>

        {/* Left */}
        <div style={{
          background:"#0D1117",
          width: isTablet ? "100%" : "220px",
          flexShrink:0,
          padding: isTablet ? "2rem" : "2.5rem 2rem",
          display:"flex", flexDirection: isTablet ? "row" : "column",
          alignItems: isTablet ? "center" : "flex-start",
          justifyContent:"space-between",
          gap: isTablet ? "1.5rem" : 0,
          position:"relative", overflow:"hidden",
        }}>
          <div style={{
            position:"absolute", inset:0, opacity:0.025,
            backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize:"200px",
          }}/>

          <div style={{position:"relative", zIndex:1}}>
            <motion.div
              style={{
                width:"2.875rem", height:"2.875rem", borderRadius:"50%",
                border:"1px solid rgba(255,255,255,0.12)",
                display:"flex", alignItems:"center", justifyContent:"center",
                marginBottom: isTablet ? 0 : "2rem",
              }}
              initial={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}}
              transition={{type:"spring", stiffness:260, damping:20, delay:0.2}}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
              </svg>
            </motion.div>
          </div>

          {isTablet ? (
            <div style={{position:"relative", zIndex:1}}>
              <div style={{fontSize:"1rem", fontWeight:"300", color:"#fff", fontFamily:"'DM Serif Display', Georgia, serif"}}>Muvaffaqiyatli!</div>
              <div style={{fontSize:"0.72rem", color:"rgba(255,255,255,0.35)", marginTop:"0.2rem"}}>So'rovingiz qabul qilindi</div>
            </div>
          ) : (
            <div style={{position:"relative", zIndex:1, flex:1}}>
              <motion.h2 style={{color:"#fff", fontSize:"1.5rem", fontWeight:"300", fontFamily:"'DM Serif Display', Georgia, serif", letterSpacing:"-0.025em", margin:"0 0 0.5rem"}}
                initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}>
                Muvaffaqiyatli!
              </motion.h2>
              <motion.p style={{color:"rgba(255,255,255,0.3)", fontSize:"0.78rem", lineHeight:1.6, margin:0}}
                initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.38}}>
                So'rovingiz qabul qilindi. Tez orada mutaxassislarimiz siz bilan bog'lanishadi.
              </motion.p>
            </div>
          )}
        </div>

        {/* Right */}
        <div style={{flex:1, minWidth:0, padding: isTablet ? "2rem" : "2.5rem 2.75rem", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
          <div>
            <motion.div style={{marginBottom:"1.5rem"}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}>
              <div style={{fontSize:"0.65rem", fontWeight:"600", color:"#9BA5B4", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"0.375rem"}}>O'quv markazi</div>
              <h3 style={{fontSize:"1rem", fontWeight:"500", color:"#0D1117", margin:0, letterSpacing:"-0.01em"}}>Oxford O'quv Markazi</h3>
            </motion.div>

            <motion.div
              style={{background:"#F8F9FB", borderRadius:"0.875rem", padding:"0.25rem 0.875rem", marginBottom:"1.75rem", border:"1px solid #F0F2F5"}}
              initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay:0.38}}>
              {contacts.map((item,i) => (
                <motion.div key={i}
                  style={{
                    display:"flex", alignItems:"center", gap:"0.875rem",
                    padding:"0.75rem 0",
                    borderBottom: i < contacts.length-1 ? "1px solid #EAECF0" : "none",
                  }}
                  initial={{opacity:0, x:-8}} animate={{opacity:1, x:0}} transition={{delay:0.44+i*0.07}}>
                  <div style={{color:"#9BA5B4", flexShrink:0}}>{item.icon}</div>
                  <div>
                    <div style={{fontSize:"0.6rem", color:"#BBC4D0", fontWeight:"600", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"0.1rem"}}>{item.label}</div>
                    <div style={{fontSize:"0.85rem", color:"#1A2332", fontWeight:"500"}}>{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.625rem"}}>
            <motion.a href="https://maps.app.goo.gl/t46samrMYZh97fk16" target="_blank" rel="noopener noreferrer"
              style={{
                display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
                padding:"0.75rem", borderRadius:"0.625rem",
                background:"#0D1117", color:"#fff",
                fontWeight:"500", fontSize:"0.825rem", textDecoration:"none",
              }}
              initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay:0.62}}
              whileHover={{opacity:0.85}} whileTap={{scale:0.98}}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
              Manzil
            </motion.a>
            <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay:0.68}}>
              <Link href="/" style={{
                display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
                padding:"0.75rem", borderRadius:"0.625rem",
                border:"1px solid #E2E6EC", color:"#6B7280",
                fontWeight:"500", fontSize:"0.825rem", textDecoration:"none",
                background:"#fff",
              }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
                Bosh sahifa
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
