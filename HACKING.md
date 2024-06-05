## Reload the script to apply changes

```bash
qdbus org.kde.KWin /Scripting org.kde.kwin.Scripting.unloadScript center-new-windows && \
sleep 1 && \
qdbus org.kde.KWin /Scripting org.kde.kwin.Scripting.start
```
