import React from 'react'

export default function ConfirmDialog({ message, onCancel, onConfirm }){
  return (
    <div className="modal-overlay">
      <div className="modal card">
        <h3>Confirm</h3>
        <div style={{marginBottom:12}}>{message}</div>
        <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
          <button className="btn secondary" onClick={onCancel}>Cancel</button>
          <button className="btn" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}
