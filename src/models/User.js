import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: { type: String, required: true, minlength: 8, select: false },
		role: {
			type: String,
			enum: ["company", "admin", "tester", "super_admin", "client"],
			default: "company",
		},
		company: { type: String, trim: true },
		company_name: { type: String, trim: true },
		industry: { type: String, trim: true },
		phone: { type: String, trim: true },
		avatar: { type: String },
		isVerified: { type: Boolean, default: false },
		isSuspended: { type: Boolean, default: false },
		mfa_enabled: { type: Boolean, default: false },
		mfa_secret: { type: String, select: false },
		status: { type: String, enum: ["active", "suspended", "invited"], default: "active" },
		verificationToken: { type: String, select: false },
		verificationTokenExpiry: { type: Date, select: false },
		resetPasswordToken: { type: String, select: false },
		resetPasswordExpiry: { type: Date, select: false },
		lastLogin: { type: Date },
	},
	{ timestamps: true },
);

userSchema.pre("save", async function () {
	if (!this.isModified("password")) return;
	this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
