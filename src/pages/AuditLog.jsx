import React, { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import { LS_KEYS, readJSON } from '../utils/storage'

export default function AuditLog(){
  const [filter,setFilter]=useState('')
  const all = readJSON(LS_KEYS.AUDIT, [])
  const list = useMemo(()=>{
    let out = [...all].reverse()
    if(filter) out = out.filter(a=>a.action===filter)
    return out
  },[all,filter])

  const actions = Array.from(new Set(all.map(a=>a.action))).filter(Boolean)

  return (
    <div className="app">
      <Navbar />
      <div className="card">
        <h1>Audit Log</h1>
        <div className="controls">
          <select className="filter-select" value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="">All actions</option>
            {actions.map(a=> <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <table className="table">
          <thead><tr><th style={{minWidth:180}}>Time</th><th style={{minWidth:100}}>Action</th><th style={{minWidth:150}}>Actor</th><th>Message</th></tr></thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign:'center',padding:20,color:'#989797'}}>No audit events yet</td></tr>
            ) : (
              list.map((a,idx)=> (
                <tr key={idx}>
                  <td className="small muted">{new Date(a.timestamp).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${
                      a.action === 'CREATE' ? 'blue' :
                      a.action === 'UPDATE' ? 'indigo' :
                      'pink'
                    }`}>
                      {a.action}
                    </span>
                  </td>
                  <td style={{fontSize:'13px'}}>{a.actor}</td>
                  <td>{a.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
