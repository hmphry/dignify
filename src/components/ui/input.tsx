import { useId, useState } from 'react'

export interface Input {
    type: string,
    placeholder: string,
    label: string,
    children?: React.ReactNode,
    value?: string,
    className?: string,
    required?: boolean,
    disabled?: boolean,
    autoComplete?: string,
    autoFocus?: boolean,
    maxLength?: number,
    minLength?: number,
    pattern?: string,
    readOnly?: boolean,
    name?: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void,
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void,
}

export default function Input({label, children, ...properties}: Input) {
    const id = useId();
    return (
        <div className='relative z-0 grid grid-col-1'>
            <label htmlFor={id} className='pl-2'>{label}</label>
            <input 
                id={id}
                className='p-2 rounded-lg border-2 border-background-600 focus-within:border-foreground-900 outline-none' 
                {...properties}
            />
            {children}
        </div>
    );
}



export function PasswordInput(properties: Input) {
    const [inputHidden, setInputHidden] = useState(true);
    const toggleInputHidden = () => {
        setInputHidden((previousState: boolean) => !previousState);
    };
    return (
        <Input {...properties}  type={inputHidden ? "password" : "text"}>
            <button type="button" onClick={toggleInputHidden}>{inputHidden ? "show" : "hide"}</button>
        </Input>
    );
}



