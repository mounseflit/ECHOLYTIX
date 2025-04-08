import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import altair as alt
import random
import datetime
import torch
import torch.nn as nn
import torch.nn.functional as F
from transformers import pipeline

# Simulate IoT acoustic data generation
def simulate_iot_data(n=100):
    noise_types = ['Traffic', 'Construction', 'Nightlife', 'Industrial', 'Other']
    locations = ['Casablanca - Maarif', 'Casablanca - Sidi Bernoussi', 'Casablanca - Ain Sebaa',
                 'Rabat - Agdal', 'Rabat - Hay Riad', 'Tangier - Centre Ville']
    data = []
    for _ in range(n):
        waveform = np.random.rand(100)  # placeholder for waveform data
        label = random.choice(noise_types)
        data.append({
            'timestamp': datetime.datetime.now() - datetime.timedelta(seconds=random.randint(0, 7200)),
            'location': random.choice(locations),
            'waveform': waveform,
            'true_noise_type': label,
            'dB_level': round(random.uniform(50, 100), 2),
            'feedback': random.choice([
                "Too noisy at night! Can't sleep!",
                "Construction noise during working hours is acceptable.",
                "Traffic is unbearable in the mornings.",
                "Noise is low in this area.",
                "Nightlife is too loud on weekends."
            ])
        })
    return pd.DataFrame(data)

# Simple CNN for noise classification (placeholder architecture)
class DummyCNN(nn.Module):
    def __init__(self, num_classes):
        super(DummyCNN, self).__init__()
        self.conv1 = nn.Conv1d(in_channels=1, out_channels=16, kernel_size=3, padding=1)
        self.pool = nn.MaxPool1d(kernel_size=2, stride=2)
        self.conv2 = nn.Conv1d(16, 32, 3, padding=1)
        self.fc1 = nn.Linear(32 * 25, 64)
        self.fc2 = nn.Linear(64, num_classes)

    def forward(self, x):
        x = x.unsqueeze(1)  # add channel dimension
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = x.view(x.size(0), -1)
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        return F.log_softmax(x, dim=1)

# Instantiate model and classifier
def classify_waveform(waveform, model, labels):
    tensor = torch.tensor(waveform, dtype=torch.float32).unsqueeze(0)
    with torch.no_grad():
        output = model(tensor)
    pred_idx = torch.argmax(output, dim=1).item()
    return labels[pred_idx]

# Load data and run classification
noise_labels = ['Traffic', 'Construction', 'Nightlife', 'Industrial', 'Other']
data = simulate_iot_data(150)
model = DummyCNN(num_classes=len(noise_labels))
data['predicted_noise_type'] = data['waveform'].apply(lambda w: classify_waveform(w, model, noise_labels))

# Sentiment analysis using LLM pipeline
sentiment_pipeline = pipeline("sentiment-analysis")
data['sentiment'] = data['feedback'].apply(lambda text: sentiment_pipeline(text)[0]['label'])
data['sentiment_score'] = data['feedback'].apply(lambda text: sentiment_pipeline(text)[0]['score'] if sentiment_pipeline(text)[0]['label'] == 'POSITIVE' else -sentiment_pipeline(text)[0]['score'])

# Streamlit UI
st.set_page_config(page_title="ECHOLYTIX Dashboard", layout="wide")
st.title("ECHOLYTIX - Urban Noise Monitoring")
st.markdown("AI-powered urban noise classification and citizen sentiment analysis")

# Sidebar filters
with st.sidebar:
    st.header("Filters")
    selected_location = st.multiselect("Select Location(s)", options=data['location'].unique(), default=data['location'].unique())
    selected_noise_type = st.multiselect("Select Predicted Noise Type(s)", options=data['predicted_noise_type'].unique(), default=data['predicted_noise_type'].unique())

filtered_data = data[(data['location'].isin(selected_location)) & (data['predicted_noise_type'].isin(selected_noise_type))]

# Metrics
col1, col2, col3 = st.columns(3)
col1.metric("Average dB Level", f"{filtered_data['dB_level'].mean():.2f} dB")
col2.metric("Most Common Predicted Noise", filtered_data['predicted_noise_type'].mode()[0])
col3.metric("Avg. Sentiment Score", f"{filtered_data['sentiment_score'].mean():.2f}")

# Visualizations
st.subheader("Noise Levels by Type")
bar_chart = alt.Chart(filtered_data).mark_bar().encode(
    x='predicted_noise_type',
    y='dB_level',
    color='predicted_noise_type'
).properties(width=600)
st.altair_chart(bar_chart, use_container_width=True)

st.subheader("Sentiment Score Distribution")
st.hist(filtered_data['sentiment_score'], bins=20, use_container_width=True)

st.subheader("Noise Readings Over Time")
st.line_chart(filtered_data.set_index('timestamp')['dB_level'])

st.subheader("Citizen Feedback Sample")
st.dataframe(filtered_data[['timestamp', 'location', 'predicted_noise_type', 'feedback', 'sentiment', 'sentiment_score']].head(10))

# Feedback
st.markdown("### Stakeholder Feedback")
st.text_area("Leave your comments or suggestions below:", height=150)
st.button("Submit Feedback")
