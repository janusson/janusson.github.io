"""
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def hydrogen_wavefunction(n, l, m, r, theta, phi):
    # Simplified radial part of the hydrogen wavefunction
    if n == 1 and l == 0:
        return np.exp(-r)
    elif n == 2 and l == 0:
        return (2 - r) * np.exp(-r / 2)
    elif n == 2 and l == 1:
        if m == 0:
            return r * np.exp(-r / 2) * np.cos(theta)
        elif m == 1:
            return r * np.exp(-r / 2) * np.sin(theta) * np.cos(phi)
        elif m == -1:
            return r * np.exp(-r / 2) * np.sin(theta) * np.sin(phi)
    else:
        return np.zeros_like(r)

def plot_orbital(n, l, m):
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')

    r = np.linspace(0, 20, 100)
    theta = np.linspace(0, np.pi, 100)
    phi = np.linspace(0, 2 * np.pi, 100)

    r, theta, phi = np.meshgrid(r, theta, phi)
    psi = hydrogen_wavefunction(n, l, m, r, theta, phi)
    psi2 = np.abs(psi)**2

    x = r * np.sin(theta) * np.cos(phi)
    y = r * np.sin(theta) * np.sin(phi)
    z = r * np.cos(theta)

    # Ensure x, y, and z are 2-dimensional
    x = x[:, :, 0]
    y = y[:, :, 0]
    z = z[:, :, 0]
    psi2 = psi2[:, :, 0]

    ax.plot_surface(x, y, z, facecolors=plt.cm.viridis(psi2 / psi2.max()), rstride=5, cstride=5, alpha=0.6, linewidth=0)
    ax.set_xlabel('X')
    ax.set_ylabel('Y')
    ax.set_zlabel('Z')
    plt.show()

# Plotting the 1s orbital
plot_orbital(1, 0, 0)

# Plotting the 2p orbital (m=0)
# plot_orbital(2, 1, 0)
"""
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def hydrogen_wavefunction(n, l, m, r, theta, phi):
    # Radial component of hydrogen wavefunction
    if n == 1 and l == 0:
        return np.exp(-r)
    elif n == 2 and l == 0:
        return (2 - r) * np.exp(-r / 2)
    elif n == 2 and l == 1:
        if m == 0:
            return r * np.exp(-r / 2) * np.cos(theta)
        elif m == 1:
            return r * np.exp(-r / 2) * np.sin(theta) * np.cos(phi)
        elif m == -1:
            return r * np.exp(-r / 2) * np.sin(theta) * np.sin(phi)
    else:
        return np.zeros_like(r)

def plot_orbital(n, l, m):
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')

    r = np.linspace(0, 10, 100)
    theta = np.linspace(0, np.pi, 100)
    phi = np.linspace(0, 2 * np.pi, 100)

    r, theta, phi = np.meshgrid(r, theta, phi)
    psi = hydrogen_wavefunction(n, l, m, r, theta, phi)
    psi2 = np.abs(psi)**2

    x = r * np.sin(theta) * np.cos(phi)
    y = r * np.sin(theta) * np.sin(phi)
    z = r * np.cos(theta)

    # Reshape arrays for plotting
    x = x.reshape(-1)
    y = y.reshape(-1)
    z = z.reshape(-1)
    psi2 = psi2.reshape(-1)

    ax.plot_trisurf(x, y, z, cmap='viridis', alpha=0.6, linewidth=0, antialiased=True)
    ax.set_xlabel('X')
    ax.set_ylabel('Y')
    ax.set_zlabel('Z')

    return plt.show()

# Plot the 1s orbital
# plot_orbital(1, 0, 0)

# Plotting the 2p orbital (m=0)
plot_orbital(2, 1, 0)
