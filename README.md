# ECHOLYTIX – Urban Noise Monitoring Platform

ECHOLYTIX is a Streamlit-based AI prototype designed to help cities like Casablanca monitor and respond to urban noise pollution using real-time IoT simulation, machine learning, and citizen feedback.

## 🔧 Features

- 🎧 **IoT Simulation**: Generates synthetic acoustic waveform data from various Moroccan cities.
- 🧠 **Noise Classification**: Uses a basic CNN model to classify noise types (Traffic, Construction, Nightlife, etc.).
- 💬 **Sentiment Analysis**: Integrates a HuggingFace transformer pipeline to analyze citizen feedback and rate sentiment.
- 📊 **Interactive Dashboard**: Allows users to explore noise levels, sentiments, and patterns by time, type, and location.
- 🗣️ **Stakeholder Feedback Module**: Collects user input for iterative improvement.

## 🧪 Getting Started

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the App

```bash
streamlit run app.py
```

## 🧠 Technologies Used

- `Streamlit` for the UI
- `PyTorch` for CNN-based noise classification
- `Transformers` by HuggingFace for sentiment analysis
- `Altair` and `Matplotlib` for data visualization

## 📂 Project Structure

- `app.py`: Main application file
- `requirements.txt`: Dependencies

## 📈 Roadmap

- Improve CNN model with real sound data
- Add geographic map for noise heatmap
- Integrate real-time IoT sensor feeds

## 👥 Authors

- Mounsef Litniti
- Othmane Sadiki
- Bader Eddine Tadlaoui

Made with ❤️ at EMSI - Ecole Marocaine des Sciences de l'Ingénieur

---

**Note**: This is a prototype and not a production-ready tool. It is intended for educational and research purposes.