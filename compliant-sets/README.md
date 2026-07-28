# OpenAPI Overlay Compliant Sets

The folders in this directory contain sets of "known good" Overlays, along with target documents before and after the Overlay.
These files are offered as examples of how a series of Overlays are expected to be applied, with the aim of supporting people building tools that apply Overlays.

Each directory contains:
- `overlay.yaml` - the Overlay
- a target document to use, named after its format: `openapi.yaml`, `asyncapi.yaml` or `arazzo.yaml`
- `output.yaml` - the target document after the Overlay has been applied
