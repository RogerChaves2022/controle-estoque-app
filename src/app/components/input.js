export const Input = ({ value, handleChange, placeholder, label, type, min, name }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '80%', margin: '0 auto', padding: '5px 10px' }}>
      { !!label && (
      <>
        <label style={{ alignSelf: 'flex-start' }}>{label}</label>
      </>
    ) }
    <input
      className="input"
      type={type || 'text'}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      min={min || null}
      name={name}
    />
    </div>
  )
}
