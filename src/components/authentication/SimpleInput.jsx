function SimpleInput({type, name, placeholder, value, onChange, isInvalid, errMsg, isRequired}) {
    return (
        <div>
            <input
                className={`w-full h-10 p-1 border ${isInvalid ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-md focus:outline-none focus:border-blue-500`}
                type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} required={isRequired}/>

            {isInvalid && (
                <p className="text-red-500 text-sm mt-1">{errMsg}</p>
            )}
        </div>)
}

export default SimpleInput;