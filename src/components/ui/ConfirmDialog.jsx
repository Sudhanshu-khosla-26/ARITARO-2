"use client";

import { useState, useCallback } from "react";

export function useConfirm() {
	const [state, setState] = useState(null);

	const confirm = useCallback(({ title, description, confirmLabel = "Confirm", variant = "danger" }) => {
		return new Promise((resolve) => {
			setState({ title, description, confirmLabel, variant, resolve });
		});
	}, []);

	function handleChoice(result) {
		state?.resolve(result);
		setState(null);
	}

	const confirmBtnStyle = {
		danger: {
			background: "rgba(239,68,68,0.15)",
			border: "1px solid rgba(239,68,68,0.4)",
			color: "#F87171",
		},
		warning: {
			background: "rgba(245,158,11,0.15)",
			border: "1px solid rgba(245,158,11,0.4)",
			color: "#FBBF24",
		},
		primary: {
			background: "rgba(99,102,241,0.15)",
			border: "1px solid rgba(99,102,241,0.4)",
			color: "#818CF8",
		},
	};

	const Dialog = state ? (
		<>
			{/* Backdrop */}
			<div
				onClick={() => handleChoice(false)}
				style={{
					position: "fixed",
					inset: 0,
					background: "rgba(0,0,0,0.6)",
					backdropFilter: "blur(4px)",
					WebkitBackdropFilter: "blur(4px)",
					zIndex: 9998,
				}}
			/>
			{/* Modal */}
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="confirm-title"
				style={{
					position: "fixed",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					zIndex: 9999,
					background: "rgba(15,23,42,0.97)",
					border: "1px solid rgba(51,65,85,0.7)",
					borderRadius: 16,
					padding: "28px 32px",
					width: "100%",
					maxWidth: 420,
					boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
					animation: "confirmIn 0.18s ease",
				}}
			>
				<style>{`
					@keyframes confirmIn {
						from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
						to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
					}
				`}</style>

				{/* Icon */}
				<div style={{ fontSize: 28, marginBottom: 12 }}>
					{state.variant === "danger" ? "🗑️" : state.variant === "warning" ? "⚠️" : "❓"}
				</div>

				<h2
					id="confirm-title"
					style={{ fontSize: 17, fontWeight: 700, color: "#F1F5F9", marginBottom: 8 }}
				>
					{state.title}
				</h2>

				{state.description && (
					<p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6, marginBottom: 24 }}>
						{state.description}
					</p>
				)}

				<div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
					<button
						onClick={() => handleChoice(false)}
						style={{
							padding: "9px 18px",
							borderRadius: 9,
							fontSize: 13,
							cursor: "pointer",
							background: "rgba(51,65,85,0.4)",
							border: "1px solid rgba(51,65,85,0.6)",
							color: "#94A3B8",
						}}
					>
						Cancel
					</button>
					<button
						onClick={() => handleChoice(true)}
						style={{
							padding: "9px 18px",
							borderRadius: 9,
							fontSize: 13,
							fontWeight: 600,
							cursor: "pointer",
							...(confirmBtnStyle[state.variant] ?? confirmBtnStyle.danger),
						}}
					>
						{state.confirmLabel}
					</button>
				</div>
			</div>
		</>
	) : null;

	return [Dialog, confirm];
}
