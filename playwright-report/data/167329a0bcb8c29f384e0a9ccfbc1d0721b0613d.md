# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: analytics.spec.js >> Advanced Analytics Module >> should display FFMI, WHR and BF% when all measurements are provided
- Location: tests/e2e/analytics.spec.js:4:3

# Error details

```
Error: page.evaluate: TypeError: Cannot read properties of undefined (reading 'exec')
    at eval (eval at evaluate (:311:30), <anonymous>:2:33)
    at UtilityScript.evaluate (<anonymous>:313:16)
    at UtilityScript.<anonymous> (<anonymous>:1:44)
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic "Powrót do ekranu startowego" [ref=e4] [cursor=pointer]:
        - img "Logo" [ref=e5]
        - heading "Uki's BodyBuild" [level=1] [ref=e6]
      - list [ref=e7]:
        - listitem [ref=e8]:
          - link "Pulpit Główny" [ref=e9] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e10]:
          - link "Pomiary Ciała" [ref=e11] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e12]:
          - link "Trening" [ref=e13] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e14]:
          - link "Historia Treningów" [ref=e15] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e16]:
          - link "Analiza Progresu" [active] [ref=e17] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e18]:
          - link "Dieta i Żywienie" [ref=e19] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e20]:
          - link "Diagnostyka" [ref=e21] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e22]:
          - link "Profil i Ustawienia" [ref=e23] [cursor=pointer]:
            - /url: "#"
      - generic [ref=e24]:
        - link [ref=e26] [cursor=pointer]:
          - /url: https://suppi.pl/ukidives
          - text: ☕ Podoba Ci się to narzędzie?
          - strong [ref=e27]: Postaw mi kawę!
        - generic [ref=e28]: Trial (7 dni) v2026.8.28.01
    - main [ref=e29]:
      - generic [ref=e31]:
        - generic [ref=e32]:
          - heading "Analiza Progresu" [level=2] [ref=e33]
          - paragraph [ref=e34]: Wykresy i statystyki
        - generic [ref=e35]:
          - generic [ref=e36]:
            - strong [ref=e37]: Pomiary pod kontrolą ✅
            - paragraph [ref=e38]: Ostatni pomiar robiłeś 23 dni temu. Trzymaj tak dalej!
          - paragraph [ref=e39]: Za mało danych treningowych do przeprowadzenia analizy.
          - heading "Regeneracja i Atlas Mięśni" [level=4] [ref=e40]
          - paragraph [ref=e41]: Brak danych treningowych do analizy regeneracji.
          - heading "Analiza składu ciała" [level=4] [ref=e42]
          - generic [ref=e43]:
            - generic [ref=e44]:
              - strong [ref=e45]: Szacunkowy BF%
              - button "ℹ️" [ref=e46] [cursor=pointer]
              - generic [ref=e47]: 16.1 %
              - paragraph [ref=e48]: Dobra kondycja (Fitness)
              - paragraph [ref=e49]: Tkanka tłuszczowa wg wzoru US Navy
            - generic [ref=e50]:
              - strong [ref=e51]: FFMI (Index Beztłuszczowy)
              - button "ℹ️" [ref=e52] [cursor=pointer]
              - generic [ref=e53]: "20.7"
              - paragraph [ref=e54]: Dobra muskulatura (Wysportowany)
              - paragraph [ref=e55]: Wskaźnik suchej masy mięśniowej
            - generic [ref=e56]:
              - strong [ref=e57]: WHR (Talia-Biodra)
              - button "ℹ️" [ref=e58] [cursor=pointer]
              - generic [ref=e59]: "0.89"
              - paragraph [ref=e60]: Zdrowe proporcje (Niskie ryzyko)
              - paragraph [ref=e61]: Proporcje sylwetki
          - generic [ref=e62]:
            - button "📤 Udostępnij swój progres" [ref=e63] [cursor=pointer]
            - paragraph [ref=e64]: Pochwal się na Facebooku lub Instagramie!
  - text: ✕
  - button "🤖" [ref=e65] [cursor=pointer]
```