import { useEffect, useMemo, useRef, useState } from "react";
import { defer, fromEvent, of, timer } from "rxjs";
import { finalize, switchMapTo, tap } from "rxjs/operators";

export function ClickExample() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const getUsers$ = useMemo(() => {
    return defer(() => {
      setLoading(true);
      return timer(2000).pipe(
        switchMapTo(of([{id: 'id-1', name: 'user-1'}])),
        tap((res) => {
          setUsers(res);
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
