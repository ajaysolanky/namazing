"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5efe6",
            padding: "24px",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <h2
              style={{
                fontFamily: "serif",
                fontSize: "24px",
                color: "#1f2933",
                marginBottom: "12px",
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                color: "#1f2933",
                opacity: 0.6,
                marginBottom: "24px",
              }}
            >
              We encountered an unexpected error. Please try again.
            </p>
            <button
              onClick={reset}
              style={{
                backgroundColor: "#1f2933",
                color: "white",
                padding: "12px 24px",
                borderRadius: "9999px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
