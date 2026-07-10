"use client";

import { useState } from "react";
import { submitContact } from "@/actions/contact.actions";
import { toast } from "sonner";

const labelStyle = {
	display: "block",
	fontFamily: "var(--font-sans)",
	fontSize: 12,
	fontWeight: 500,
	color: "var(--text-muted)",
	marginBottom: 6,
};

function getInputStyle(focused, fieldName) {
	return {
		width: "100%",
		padding: "11px 14px",
		background: "var(--bg-base)",
		border: `1px solid ${focused === fieldName ? "rgba(59,130,246,0.6)" : "var(--border-subtle)"}`,
		borderRadius: 7,
		color: "var(--text-primary)",
		fontFamily: "var(--font-sans)",
		fontSize: 14,
		outline: "none",
		transition: "border-color 0.2s ease",
		boxSizing: "border-box",
		boxShadow:
			focused === fieldName ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
	};
}

export function ContactForm() {
	const [loading, setLoading] = useState(false);
	const [focused, setFocused] = useState("");

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		const result = await submitContact(new FormData(e.currentTarget));
		setLoading(false);
		if (!result.success) {
			toast.error(result.error);
			return;
		}
		toast.success(result.message);
		e.currentTarget.reset();
	}

	return (
		<form onSubmit={handleSubmit}>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: 14,
					marginBottom: 14,
				}}
				className="contact-form-row"
			>
				<div>
					<label
						htmlFor="name"
						style={labelStyle}
					>
						Full Name *
					</label>
					<input
						id="name"
						name="name"
						type="text"
						placeholder="John Smith"
						required
						style={getInputStyle(focused, "name")}
						onFocus={() => setFocused("name")}
						onBlur={() => setFocused("")}
					/>
				</div>
				<div>
					<label
						htmlFor="email"
						style={labelStyle}
					>
						Work Email *
					</label>
					<input
						id="email"
						name="email"
						type="email"
						placeholder="john@company.com"
						required
						style={getInputStyle(focused, "email")}
						onFocus={() => setFocused("email")}
						onBlur={() => setFocused("")}
					/>
				</div>
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: 14,
					marginBottom: 14,
				}}
				className="contact-form-row"
			>
				<div>
					<label
						htmlFor="company"
						style={labelStyle}
					>
						Company
					</label>
					<input
						id="company"
						name="company"
						type="text"
						placeholder="Acme Corp"
						style={getInputStyle(focused, "company")}
						onFocus={() => setFocused("company")}
						onBlur={() => setFocused("")}
					/>
				</div>
				<div>
					<label
						htmlFor="phone"
						style={labelStyle}
					>
						Phone
					</label>
					<input
						id="phone"
						name="phone"
						type="tel"
						placeholder="+91 98765 43210"
						style={getInputStyle(focused, "phone")}
						onFocus={() => setFocused("phone")}
						onBlur={() => setFocused("")}
					/>
				</div>
			</div>

			<div style={{ marginBottom: 14 }}>
				<label
					htmlFor="subject"
					style={labelStyle}
				>
					Subject *
				</label>
				<input
					id="subject"
					name="subject"
					type="text"
					placeholder="What is this about?"
					required
					style={getInputStyle(focused, "subject")}
					onFocus={() => setFocused("subject")}
					onBlur={() => setFocused("")}
				/>
			</div>

			<div style={{ marginBottom: 22 }}>
				<label
					htmlFor="message"
					style={labelStyle}
				>
					Message *
				</label>
				<textarea
					id="message"
					name="message"
					rows={5}
					placeholder="Tell us more about your inquiry..."
					required
					style={{
						...getInputStyle(focused, "message"),
						resize: "vertical",
						minHeight: 120,
					}}
					onFocus={() => setFocused("message")}
					onBlur={() => setFocused("")}
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				className="btn-primary"
				style={{
					width: "100%",
					justifyContent: "center",
					padding: "14px",
					fontSize: 15,
					opacity: loading ? 0.75 : 1,
					cursor: loading ? "wait" : "pointer",
				}}
			>
				{loading ? (
					<>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							style={{ animation: "rotate-slow 1s linear infinite" }}
						>
							<path d="M21 12a9 9 0 11-6.219-8.56" />
						</svg>
						Sending…
					</>
				) : (
					<>
						Send Message
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M5 12h14M12 5l7 7-7 7" />
						</svg>
					</>
				)}
			</button>

			<p
				style={{
					fontSize: 12,
					color: "var(--text-muted)",
					textAlign: "center",
					marginTop: 12,
				}}
			>
				Your data is encrypted and never shared. No spam, ever.
			</p>

			<style>{`
        @media (max-width: 600px) {
          .contact-form-row { grid-template-columns: 1fr !important; }
        }
        input::placeholder, textarea::placeholder { color: var(--text-muted); opacity: 0.5; }
      `}</style>
		</form>
	);
}
