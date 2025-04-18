import * as React from "react";
const {   useContext, useEffect, useRef, useState   } = React;

// A simple shallowEqual implementation
function shallowEqual(objA: any, objB: any): boolean {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (
      !Object.prototype.hasOwnProperty.call(objB, key) ||
      !Object.is(objA[key], objB[key])
    ) {
      return false;
    }
  }

  return true;
}

/**
 * A hook that selects a portion of a context value, preventing re-renders
 * when unrelated parts of the context change.
 *
 * @param context The React context to use
 * @param selector A function that extracts values from the context
 * @returns The selected portion of the context value
 *
 * @example
 * ```tsx
 * // Create a context
 * const MyContext = createContext({ count: 0, user: { name: 'John' } });
 *
 * // In a component
 * const count = useContextSelector(MyContext, state => state.count);
 * // Component re-renders only when count changes, not when user changes
 * ```
 */
export function useContextSelector<T, R>(
  context: React.Context<T>,
  selector: (value: T) => R,
): R {
  // Get the full context value
  const contextValue = useContext(context);

  // Calculate the selected value
  const selectedValue = selector(contextValue);

  // Store the previous value for comparison
  const previousSelectedRef = useRef<R>(selectedValue);

  // State that will trigger re-renders
  const [, forceRender] = useState<object>({});

  // Update logic
  useEffect(() => {
    // Get the latest selected value
    const newSelectedValue = selector(contextValue);

    // Compare with the previous value (shallow equality)
    if (!shallowEqual(previousSelectedRef.current, newSelectedValue)) {
      // Update ref and trigger re-render if different
      previousSelectedRef.current = newSelectedValue;
      forceRender({});
    }
  }, [contextValue, selector]);

  return selectedValue;
}

/**
 * Creates a memoized selector function to use with useContextSelector
 *
 * @param selector The selector function to memoize
 * @returns A memoized version of the selector
 *
 * @example
 * ```tsx
 * const selectCount = createSelector(state => state.count);
 * const count = useContextSelector(MyContext, selectCount);
 * ```
 */
export function createSelector<T, R>(
  selector: (value: T) => R,
): (value: T) => R {
  return selector;
}

/**
 * A hook that tracks all dependencies from a context and
 * only re-renders if any of them change.
 *
 * @param context The React context to use
 * @param deps An array of functions that extract values from the context
 * @returns The full context value
 *
 * @example
 * ```tsx
 * const context = useContextWithDeps(MyContext, [
 *   state => state.count,
 *   state => state.user.name
 * ]);
 * // Component re-renders only when count or user.name changes
 * ```
 */
export function useContextWithDeps<T>(
  context: React.Context<T>,
  deps: Array<(value: T) => any>,
): T {
  // Get the full context value
  const contextValue = useContext(context);

  // Store the previous deps for comparison
  const previousDepsRef = useRef<any[]>(deps.map((dep) => dep(contextValue)));

  // State that will trigger re-renders
  const [, forceRender] = useState<object>({});

  // Update logic
  useEffect(() => {
    // Calculate current dependencies
    const currentDeps = deps.map((dep) => dep(contextValue));

    // Check if any dependency changed
    const shouldUpdate = currentDeps.some(
      (dep, index) => !shallowEqual(dep, previousDepsRef.current[index]),
    );

    if (shouldUpdate) {
      // Update refs and trigger re-render
      previousDepsRef.current = currentDeps;
      forceRender({});
    }
  }, [contextValue, ...deps]);

  return contextValue;
}

/**
 * Creates a new version of a context that supports selectors
 *
 * @param context The original React context
 * @returns A wrapped context with selector support
 *
 * @example
 * ```tsx
 * const MyContext = createContext({ count: 0, user: { name: 'John' } });
 * const SelectableContext = createSelectableContext(MyContext);
 *
 * // Later in a component
 * const { useSelector } = SelectableContext;
 * const count = useSelector(state => state.count);
 * ```
 */
export function createSelectableContext<T>(context: React.Context<T>) {
  /**
   * Hook for selecting from the context
   */
  function useSelector<R>(selector: (value: T) => R): R {
    return useContextSelector(context, selector);
  }

  /**
   * Hook for accessing the full context value
   */
  function useValue(): T {
    return useContext(context);
  }

  return {
    context,
    useSelector,
    useValue,
  };
}

export default useContextSelector;
