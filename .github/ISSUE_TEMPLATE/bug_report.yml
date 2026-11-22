name: 🐛 Bug Report
description: Report a bug or unexpected behavior
labels: ["bug", "triage"]
body:
  - type: markdown
    attributes:
      value: |
        **Thank you for helping improve meCraft!** Please fill in as much as you can.
  - type: dropdown
    id: app
    attributes:
      label: Which app is affected?
      options:
        - meCraft Launcher
        - mePDF Studio
        - mePhoto Studio
        - All Apps
        - Other
    validations:
      required: true
  - type: textarea
    id: description
    attributes:
      label: What happened?
      placeholder: Describe the bug clearly
    validations:
      required: true
  - type: textarea
    id: steps
    attributes:
      label: Steps to reproduce
      placeholder: "1. Open PDF\n2. Click Compress\n3. See error"
  - type: dropdown
    id: platform
    attributes:
      label: Platform
      options:
        - Web (Browser)
        - Desktop (Windows .exe)
        - Both
