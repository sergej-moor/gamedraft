/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [],
	theme: {
		colors: {
			gray: {
				800: "#171617",
				700: "#2D2D31",
				600: "#262526",
				400: "#333333",
				200: "#454546",
				100: "#6d6d6d",
			},
			red: {
				200: "#F24C3D",
			},
			blue: {
				500: "#04395E",
				200: "#007FD4",
			},

			white: "#E4E3ED",
		},

		borderRadius: {
			DEFAULT: "1rem",
			sm: "0.25rem",
		},

		extend: {},
	},
	plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
