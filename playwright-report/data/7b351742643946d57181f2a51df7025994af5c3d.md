# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: analytics.spec.js >> Advanced Analytics Module >> should display missing data warning when neck is not provided
- Location: tests/e2e/analytics.spec.js:60:3

# Error details

```
Error: page.evaluate: TypeError: Cannot read properties of undefined (reading 'exec')
    at eval (eval at evaluate (:311:30), <anonymous>:2:33)
    at UtilityScript.evaluate (<anonymous>:313:16)
    at UtilityScript.<anonymous> (<anonymous>:1:44)
```

# Page snapshot

```yaml
- generic [ref=f1e1]:
  - generic [ref=f1e2]:
    - navigation [ref=f1e3]:
      - generic "Powrót do ekranu startowego" [ref=f1e4] [cursor=pointer]:
        - img "Logo" [ref=f1e5]
        - heading "Uki's BodyBuild" [level=1] [ref=f1e6]
      - list [ref=f1e7]:
        - listitem [ref=f1e8]:
          - link "Pulpit Główny" [ref=f1e9] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f1e10]:
          - link "Pomiary Ciała" [ref=f1e11] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f1e12]:
          - link "Trening" [ref=f1e13] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f1e14]:
          - link "Historia Treningów" [ref=f1e15] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f1e16]:
          - link "Analiza Progresu" [active] [ref=f1e17] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f1e18]:
          - link "Dieta i Żywienie" [ref=f1e19] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f1e20]:
          - link "Profil i Ustawienia" [ref=f1e21] [cursor=pointer]:
            - /url: "#"
      - generic [ref=f1e22]:
        - link [ref=f1e24] [cursor=pointer]:
          - /url: https://suppi.pl/ukidives
          - text: ☕ Podoba Ci się to narzędzie?
          - strong [ref=f1e25]: Postaw mi kawę!
        - generic [ref=f1e26]: v.2026.8.9.09
    - main [ref=f1e27]:
      - generic [ref=f1e29]:
        - generic [ref=f1e30]:
          - heading "Analiza Progresu" [level=2] [ref=f1e31]
          - paragraph [ref=f1e32]: Wykresy i statystyki
        - generic [ref=f1e33]:
          - generic [ref=f1e34]:
            - strong [ref=f1e35]: Pomiary pod kontrolą ✅
            - paragraph [ref=f1e36]: Ostatni pomiar robiłeś 3 dni temu. Trzymaj tak dalej!
          - paragraph [ref=f1e37]: Za mało danych treningowych do przeprowadzenia analizy.
          - heading "Regeneracja i Atlas Mięśni" [level=4] [ref=f1e38]
          - paragraph [ref=f1e39]: Brak danych treningowych do analizy regeneracji.
          - heading "Analiza składu ciała" [level=4] [ref=f1e40]
          - generic [ref=f1e41]:
            - generic [ref=f1e42]:
              - strong [ref=f1e43]: Brak danych do wyliczenia BF%
              - paragraph [ref=f1e44]: "Uzupełnij: Szyja w zakładce Pomiary Ciała."
            - generic [ref=f1e45]:
              - strong [ref=f1e46]: WHR (Talia-Biodra)
              - button "ℹ️" [ref=f1e47] [cursor=pointer]
              - generic [ref=f1e48]: "0.89"
              - paragraph [ref=f1e49]: Zdrowe proporcje (Niskie ryzyko)
              - paragraph [ref=f1e50]: Proporcje sylwetki
          - generic [ref=f1e51]:
            - button "📤 Udostępnij swój progres" [ref=f1e52] [cursor=pointer]
            - paragraph [ref=f1e53]: Pochwal się na Facebooku lub Instagramie!
  - text: ✕
  - button "🤖" [ref=f1e54] [cursor=pointer]
```