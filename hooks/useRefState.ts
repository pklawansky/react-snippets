import { useState, useRef, MutableRefObject } from 'react';
/**
 * The purpose of this hook is to provide a tightly bound, instantly accessible value assigned to the state through the MutableRefObject.
 * 
 * The MutableRefObject can be used to update the state in cases where timeouts and other initialisation quirks make state assume pre-existing values.
 * 
 * suppressSetStateIfUnchanged avoids setting the state if the update does not affect the expected value, reducing the cost of rerendering.
 * 
 * returns [state, updateState, stateRef]
 */
function useRefState<T>(initialValue: T): [T, (newVal: T | ((newValInner: T) => T), suppressSetStateIfUnchanged?: boolean | undefined) => void, MutableRefObject<T>] {

    const [hookState, setHookState] = useState<T>(initialValue);
    const hookRef = useRef<T>(initialValue);

    const setState = (newVal: T | ((newValInner: T) => T), suppressSetStateIfUnchanged: boolean = true) => {
        if (typeof newVal === "function") {
            /* have to cast newVal as a generic Function knowing that it has already been validated by ts when added as a parameter - could result in runtime inconsistencies */
            const newValFunc: Function = newVal;
            hookRef.current = newValFunc(hookRef.current);
        } 
        else {
            hookRef.current = newVal;
        }

        if (hookRef.current !== hookState || !suppressSetStateIfUnchanged) {
            setHookState(hookRef.current);
        }
    }

    return [
        hookState,
        setState,
        hookRef
    ];
};

export default useRefState;