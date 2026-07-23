# Spotify Development Mode

## Purpose

This project integrates with Spotify using OAuth 2.0 Authorization Code Flow. Users sign in with Spotify so the backend can call the Spotify Web API on their behalf (search, profile, followed artists, and Liked Songs). Access and refresh tokens stay on the server; the browser holds only an HTTP-only session cookie.

## Current Status

The application intentionally uses a Spotify **Development** application (Development Mode) in the Spotify Developer Dashboard.

Under Development Mode:

- Only Spotify accounts that have been explicitly added as authorized users can authenticate successfully.
- Unauthorized users may start the OAuth flow (redirect to Spotify and sign in), but Spotify will reject access for the app. They will receive an authentication failure after Spotify login.
- This behavior is expected under Spotify’s Development Mode policies.
- The backend and OAuth implementation function correctly for authorized accounts. Failures for unauthorized accounts are a platform restriction, not an application defect.

## Production Considerations

A production deployment intended for arbitrary public Spotify users would require Spotify’s approval for broader access (for example, extending or leaving Development Mode according to Spotify’s current platform policies and review process). Until that approval is granted, access remains limited to the authorized users list in the Developer Dashboard.

## Testing

Reviewers and graders can exercise the full application by either:

- Using a Spotify account that is already on the application’s authorized users list, or
- Requesting that their Spotify account be temporarily added as an authorized tester in the Spotify Developer Dashboard

Once an account is authorized, Sign in with Spotify, search, profile, followed artists, Liked Songs, and logout behave as documented in the project README.
