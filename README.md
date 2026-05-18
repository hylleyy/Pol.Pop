<img width="1080" height="360" alt="Sem Título-1" src="https://github.com/user-attachments/assets/ff4af165-e748-4621-8fad-a3805213bdaa" />

# Popular Policies

![Platform](https://img.shields.io/badge/platform-react--native-blue)
![Architecture](https://img.shields.io/badge/architecture-offline--first-green)
![Privacy](https://img.shields.io/badge/privacy-local--processing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-yellow)
![Focus](https://img.shields.io/badge/focus-digital--inclusion-purple)

> A social impact project focused on reducing administrative invisibility & democratizing access to social rights in Brazil through offline-first technology and inclusive design. 

Pol.Pop is a university-led social impact project focused on one central problem: Millions of Brazilians technically qualify for public benefits, yet never access them because the systems responsible for distributing those rights are fragmented, bureaucratic, inaccessible, or digitally exclusionary.[^1]

[^1]: Although Gov.br is widely used, there is a gap between social classes. While 94% of users in Class A accessed the portal or asked someone to access it, this number drops to only 35% in Class DE. [(CGI.br, 2025, p. 33-34)](http://cetic.br/media/analises/tic_domicilios_2025_principais_resultados.pdf#page=33)

## 🔍 Overview

Brazil has significantly modernized parts of its digital public infrastructure through initiatives such as Gov.br. However, welfare discovery and access remain highly fragmented. Different levels of government (federal, state, municipal) rarely integrate effectively, creating situations where:

- Citizens qualify for benefits but never discover them;[^2]
- Information exists but is inaccessible;[^3]
- Eligibility rules are difficult to understand;
- Administrative terminology alienates users;
- Digital exclusion prevents access entirely.[^4]

[^2]: Approximately 39% of users from social classes C, D, and E stopped accessing public policies due to connectivity limitations, and 33% stopped accessing public services in general. [(IDEC; INSTITUTO LOCOMOTIVA, 2021, p. 12)](https://idec.org.br/sites/default/files/versao_revisada_pesquisa_locomotiva.pdf#page=12)
[^3]: Approximately 14% of Brazilian households (around 28 million people) still do not have internet access. [(CGI.br, 2025, p. 12)](http://cetic.br/media/analises/tic_domicilios_2025_principais_resultados.pdf#page=12)
[^4]: IDEC points out that 4 out of 10 low-income users have already stopped accessing public policies because their data plan ran out or their connection failed while loading heavy government portals. [(IDEC; INSTITUTO LOCOMOTIVA, 2021, p. 12)](https://idec.org.br/sites/default/files/versao_revisada_pesquisa_locomotiva.pdf#page=12)

Pol.Pop focuses specifically on the gap between "A benefit exists" and "The citizen actually knows and accesses it." The platform proposes a radically simplified approach to discovering and understanding public welfare programs.

Instead of forcing citizens to navigate dozens of complex government portals, legal documents, and administrative terms, the platform translates public policy eligibility into a familiar, low-cognitive-load mobile experience inspired by social media interfaces already widely understood by low-income populations.

The project combines: offline-first infrastructure & edge computing, as a result: a mobile application capable of helping vulnerable populations identify rights and benefits they may qualify for, even with unstable internet access, outdated devices, or limited digital literacy.

## 📜 Core Values

Pol.Pop is built around a concept we internally describe as:

### "Reverse Digital Literacy"

Traditional government platforms expect citizens to learn institutional systems, terminology, and bureaucratic workflows. Pol.Pop inverts this logic. Instead of teaching citizens how to navigate government complexity, the platform adapts public policy information into interaction patterns users already understand.

Examples include:
| Screenshot | Concept |
| ---------- | ------- |
| <img width="360" alt="image" src="https://github.com/user-attachments/assets/a88a159a-c91a-4152-aeca-3320b58cf7c1" /> | TikTok-style opportunity feeds |
| <img width="360" alt="image" src="https://github.com/user-attachments/assets/4ab0c3ea-8999-408e-a1f9-6e77fbe6955b" />  | WhatsApp-inspired benefit stories |

The interface intentionally prioritizes familiarity over institutional formality.

The platform is not only designed for citizens. Social workers, CRAS coordinators, and public assistance professionals can use Pol.Pop's lightweight and simple interface as a rapid recommendation and triage tool to reduce time spent manually interpreting constantly changing eligibility rules.

### 🕵️ Privacy Preservation

Pol.Pop avoids centralized sensitive data collection whenever possible. Eligibility matching is processed locally on-device using lightweight rule engines downloaded periodically by the application.

This architecture dramatically reduces server dependencies, large-scale data leak risks, infrastructure costs & cloud processing requirements while improving LGPD compliance.

## ⚖️ Licensing
This project uses a dual-licensing model to balance open-source collaboration with the protection of our creative IP.

### Source Code

All source code in this repository is licensed under the [MIT License](LICENSE.md).
- You’re free to use, change, and share the code however you like.
- The code is provided on an "AS IS" BASIS, without warranties of any kind.

### 🎨 Artistic Assets

We love open source, but we also believe in protecting our artists! We also love technological advancements; however, no AI-generated art was used in the development of this project. Every proprietary asset was handcrafted by human artists.

Please see [README.md in the assets directory](app/assets/README.md) for specific usage terms and how you can (and can't) use these files.

### Third-Party Materials

We couldn't have made this without some awesome tools and assets. This project acknowledges and uses these third-party materials:

| Package / Technology          | Purpose                                    | License            |
| ----------------------------- | ------------------------------------------ | ------------------ |
| React Native                  | Cross-platform mobile framework            | MIT License        |
| Expo                          | Development platform and tooling           | MIT License        |
| TypeScript                    | Typed JavaScript language                  | Apache License 2.0 |
| SQLite                        | Local offline database engine              | Public Domain      |
| expo-sqlite                   | SQLite integration for Expo                | MIT License        |
| react-native-mask-input       | CPF, CEP, date, and currency input masking | MIT License        |
| Ionicons / @expo/vector-icons | Interface icons                            | MIT License        |

Additional transitive dependencies may also be included through the JavaScript/npm ecosystem. Their respective copyrights and licenses remain the property of their original authors. For complete dependency information, refer to the project's package manager lockfiles and license metadata.

You can find all the specific copyright info and full license texts refering to [NOTICE.md](NOTICE.md) file.

All government program names, trademarks, and institutional identities referenced in this repository belong to their respective owners. Their inclusion does not imply affiliation, endorsement, or official partnership.

## Post-mortem

