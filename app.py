import streamlit as st
import streamlit.components.v1 as components
import os

st.set_page_config(layout="wide", page_title="AMD Ideathon")

# Inject custom CSS to make the React app full screen
st.markdown("""
<style>
    .block-container {
        padding: 0 !important;
        margin: 0 !important;
        max-width: 100% !important;
    }
    iframe {
        width: 100vw !important;
        height: 100vh !important;
        border: none !important;
    }
    header {
        visibility: hidden !important;
    }
    footer {
        visibility: hidden !important;
    }
    #MainMenu {
        visibility: hidden !important;
    }
</style>
""", unsafe_allow_html=True)

# Define the path to the React app's build directory
build_dir = os.path.join(os.path.dirname(__file__), "dist")

if os.path.exists(build_dir):
    # Declare the component and render it
    amd_app = components.declare_component("amd_app", path=build_dir)
    amd_app()
else:
    st.error("Build directory not found. Please run `npm run build` first.")
