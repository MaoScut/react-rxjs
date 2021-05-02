import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { defer, fromEvent, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import { finalize, switchMapTo, tap } from "rxjs/operators";
import "./App.css";

function App() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const getUsers$ = useMemo(() => {
    return defer(() => {
      setLoading(true);
      return timer(2000).pipe(
        switchMapTo(ajax<any>("/api/users")),
        tap((res) => {
          setUsers(res.response.data);
        }),
        finalize(() => {
          setLoading(false);
        })
      );
    });
  }, []);
  useEffect(() => {
    const c = getUsers$.subscribe();
    return () => c.unsubscribe();
  }, [getUsers$]);
  const refreshBtn = useRef<HTMLButtonElement>(null);
  // note: when 'cancel' a button, we need to cancel all works haven't been done
  // to make sure all works are canceled, the 'precise' way is to unsubscribe click event
  // and resubscribe
  const [cancel, setCancel] = useState(0);
  useEffect(() => {
    if (refreshBtn.current) {
      const s = fromEvent(refreshBtn.current, "click")
        .pipe(switchMapTo(getUsers$))
        .subscribe();
      return () => s.unsubscribe();
    }
  }, [getUsers$, cancel]);
  return (
    <div>
      <h1>{loading ? "loading..." : "loaded"}</h1>
      <div>{JSON.stringify(users)}</div>
      <button ref={refreshBtn}>refresh</button>
      <button
        onClick={() => {
          setCancel((pre) => pre + 1);
        }}
      >
        cancel
      </button>
    </div>
  );
}

export default App;
