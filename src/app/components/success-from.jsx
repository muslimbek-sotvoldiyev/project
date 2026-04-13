"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function SuccessMessage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (isMobile) {
    return (
      <div style={{minHeight:"100vh",background:"#0a0a1a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem 1.5rem",fontFamily:"Georgia, serif",color:"white",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-20%",left:"-20%",width:"20rem",height:"20rem",borderRadius:"50%",background:"radial-gradient(circle,rgba(34,197,94,0.2),transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"-15%",right:"-15%",width:"16rem",height:"16rem",borderRadius:"50%",background:"radial-gradient(circle,rgba(14,165,233,0.15),transparent 70%)",pointerEvents:"none"}}/>

        <motion.div style={{width:"5rem",height:"5rem",borderRadius:"50%",background:"linear-gradient(135deg,rgba(34,197,94,0.2),rgba(14,165,233,0.2))",border:"2px solid rgba(34,197,94,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",marginBottom:"1.5rem"}}
          initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:260,damping:20,delay:0.2}}>
          ✓
        </motion.div>

        <motion.h2 style={{fontSize:"1.75rem",fontWeight:"700",margin:"0 0 0.5rem"}} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.4}}>
          Muvaffaqiyatli!
        </motion.h2>
        <motion.p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.85rem",margin:"0 0 2rem",lineHeight:1.6}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}>
          Sizning so'rovingiz qabul qilindi.<br/>Tez orada mutaxassislarimiz bog'lanishadi.
        </motion.p>

        <motion.div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"1.25rem",padding:"1.25rem",width:"100%",marginBottom:"1.5rem",backdropFilter:"blur(10px)"}}
          initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.6}}>
          <h3 style={{fontWeight:"600",fontSize:"1rem",marginBottom:"1rem",color:"rgba(255,255,255,0.9)"}}>Oxford O'quv Markazi</h3>
          <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
            {[{icon:"📱",text:"+998 77 323 33 77"},{icon:"📍",text:"Toshkent shahri, Yunusobod tumani"},{icon:"🕒",text:"Du - Sha: 9:00 - 18:00"}].map((item,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:"0.625rem",color:"rgba(255,255,255,0.55)",fontSize:"0.8rem"}}>
                <span>{item.icon}</span>{item.text}
              </div>
            ))}
          </div>
        </motion.div>

        <div style={{display:"flex",flexDirection:"column",gap:"0.75rem",width:"100%"}}>
          <motion.a href="https://maps.app.goo.gl/t46samrMYZh97fk16" target="_blank" rel="noopener noreferrer"
            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",padding:"0.875rem",borderRadius:"0.875rem",background:"linear-gradient(135deg,#16a34a,#059669)",color:"white",fontWeight:"600",fontSize:"0.85rem",textDecoration:"none"}}
            initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.7}}
            whileTap={{scale:0.97}}>
            📍 Manzilni ko'rish
          </motion.a>
          <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.8}}>
            <Link href="/"
              style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",padding:"0.875rem",borderRadius:"0.875rem",border:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.6)",fontWeight:"500",fontSize:"0.85rem",textDecoration:"none",background:"rgba(255,255,255,0.03)"}}>
              ← Bosh sahifaga qaytish
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight:"100vh",background:"#06060f",display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem",fontFamily:"Georgia, serif"}}>
      <motion.div style={{width:"100%",maxWidth:"52rem",background:"#0d0d24",borderRadius:"1.5rem",overflow:"hidden",border:"1px solid rgba(255,255,255,0.07)",boxShadow:"0 40px 100px rgba(0,0,0,0.7)",display:"flex"}}
        initial={{opacity:0,scale:0.97,y:20}} animate={{opacity:1,scale:1,y:0}} transition={{duration:0.6}}>

        {/* LEFT */}
        <div style={{width:"40%",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2.5rem",background:"linear-gradient(145deg,#052010 0%,#051a20 100%)"}}>
          <div style={{position:"absolute",top:"-20%",left:"-20%",width:"20rem",height:"20rem",borderRadius:"50%",background:"radial-gradient(circle,rgba(34,197,94,0.25),transparent 70%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:"-15%",right:"-15%",width:"14rem",height:"14rem",borderRadius:"50%",background:"radial-gradient(circle,rgba(14,165,233,0.15),transparent 70%)",pointerEvents:"none"}}/>

          <motion.div style={{width:"6rem",height:"6rem",borderRadius:"50%",background:"linear-gradient(135deg,rgba(34,197,94,0.2),rgba(14,165,233,0.2))",border:"2px solid rgba(34,197,94,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.5rem",marginBottom:"1.5rem",position:"relative",zIndex:1}}
            initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:260,damping:20,delay:0.3}}>
            <motion.span initial={{opacity:0,scale:0.5}} animate={{opacity:1,scale:1}} transition={{delay:0.6,type:"spring"}}>✓</motion.span>
          </motion.div>

          <motion.h2 style={{fontSize:"1.75rem",fontWeight:"700",color:"white",textAlign:"center",margin:"0 0 0.75rem",position:"relative",zIndex:1}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}>
            Muvaffaqiyatli!
          </motion.h2>
          <motion.p style={{color:"rgba(255,255,255,0.45)",textAlign:"center",fontSize:"0.82rem",lineHeight:1.6,position:"relative",zIndex:1}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}>
            Sizning so'rovingiz qabul qilindi. Tez orada mutaxassislarimiz siz bilan bog'lanishadi.
          </motion.p>
        </div>

        {/* RIGHT */}
        <div style={{flex:1,padding:"2.5rem"}}>
          <motion.h3 style={{fontSize:"1.25rem",fontWeight:"600",color:"white",margin:"0 0 0.25rem"}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}>
            Oxford O'quv Markazi
          </motion.h3>
          <motion.p style={{color:"rgba(255,255,255,0.35)",fontSize:"0.78rem",margin:"0 0 1.5rem"}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}>
            Siz bilan bog'lanishimizni kutib qoling
          </motion.p>

          <motion.div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"1rem",padding:"1.25rem",marginBottom:"1.5rem"}}
            initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.55}}>
            {[
              {icon:"📱",label:"Telefon",text:"+998 XX XXX XX XX"},
              {icon:"📍",label:"Manzil",text:"Buvayda tumani, Yangiqo'rg'on"},
              {icon:"🕒",label:"Ish vaqti",text:"Dushanba – Shanba: 9:00–18:00"},
            ].map((item,i) => (
              <motion.div key={i} style={{display:"flex",alignItems:"flex-start",gap:"0.875rem",padding:"0.75rem 0",borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none"}}
                initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.6+i*0.1}}>
                <span style={{fontSize:"1.1rem"}}>{item.icon}</span>
                <div>
                  <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.35)",fontWeight:"600",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:"0.2rem"}}>{item.label}</div>
                  <div style={{fontSize:"0.85rem",color:"rgba(255,255,255,0.75)"}}>{item.text}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
            <motion.a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",padding:"0.875rem",borderRadius:"0.875rem",background:"linear-gradient(135deg,#16a34a,#059669)",color:"white",fontWeight:"600",fontSize:"0.82rem",textDecoration:"none",boxShadow:"0 6px 20px rgba(22,163,74,0.25)"}}
              initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.75}}
              whileHover={{scale:1.04}} whileTap={{scale:0.97}}>
              📍 Manzilni ko'rish
            </motion.a>
            <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.8}}>
              <Link href="/"
                style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",padding:"0.875rem",borderRadius:"0.875rem",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.55)",fontWeight:"500",fontSize:"0.82rem",textDecoration:"none",background:"rgba(255,255,255,0.03)"}}>
                ← Bosh sahifaga
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
