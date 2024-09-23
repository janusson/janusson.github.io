#article_plots.py

#? Portfolio Allocation Pie Chart

import matplotlib.pyplot as plt

# Define your portfolio allocation
labels = ['S&P 500', 'Stocks', 'Dividend', 'Momentum']
sizes = [63.7, 16.14, 3.29, 3.66]  # Example allocation percentages
colors = ['gold', 'yellowgreen', 'lightcoral', 'lightskyblue']

# Plot
plt.figure(figsize=(8, 8))
plt.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%', startangle=140)
plt.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
plt.title('Portfolio Allocation')
plt.show()

#? Performance Comparison Line Graph

import yfinance as yf
import matplotlib.pyplot as plt

# Download historical data
tickers = ['VFV.TO', 'VMO.TO']
data = yf.download(tickers, start='2020-01-01', end='2024-08-30')['Adj Close']

# Plot
plt.figure(figsize=(12, 6))
for ticker in tickers:
    plt.plot(data[ticker], label=ticker)
plt.title('Performance Comparison')
plt.xlabel('Date')
plt.ylabel('Adjusted Close Price')
plt.legend()
plt.show()

#? Dividend Yield Bar Chart

import matplotlib.pyplot as plt

# Example dividend yields
funds = ['High Dividend Fund 1', 'High Dividend Fund 2', 'S&P 500']
yields = [4.5, 3.8, 1.5]  # Example yields

# Plot
plt.figure(figsize=(10, 6))
plt.bar(funds, yields, color=['blue', 'green', 'red'])
plt.title('Dividend Yields Comparison')
plt.xlabel('Funds')
plt.ylabel('Dividend Yield (%)')
plt.show()

#? Historical Returns Line Graph

import yfinance as yf
import matplotlib.pyplot as plt

# Download historical data
tickers = ['VFV.TO', 'VMO.TO']
data = yf.download(tickers, start='2020-01-01', end='2024-08-30')['Adj Close']

# Calculate returns
returns = data.pct_change().dropna()

# Plot
plt.figure(figsize=(12, 6))
for ticker in tickers:
    plt.plot((1 + returns[ticker]).cumprod(), label=ticker)
plt.title('Historical Returns')
plt.xlabel('Date')
plt.ylabel('Cumulative Returns')
plt.legend()
plt.show()

#? Risk vs. Return Scatter Plot

import yfinance as yf
import matplotlib.pyplot as plt
import numpy as np

# Download historical data
tickers = ['VFV.TO', 'VMO.TO']
data = yf.download(tickers, start='2020-01-01', end='2024-08-30')['Adj Close']

# Calculate returns and risk
returns = data.pct_change().dropna()
mean_returns = returns.mean() * 252  # Annualize
volatility = returns.std() * np.sqrt(252)  # Annualize

# Plot
plt.figure(figsize=(10, 6))
plt.scatter(volatility, mean_returns, c='blue', marker='o')
for i, ticker in enumerate(tickers):
    plt.text(volatility[i], mean_returns[i], ticker, fontsize=12)
plt.title('Risk vs. Return')
plt.xlabel('Annualized Volatility')
plt.ylabel('Annualized Returns')
plt.show()
