// src/utils/terminalCommands/fileSystemData.ts
// Initial file system structure for the terminal

import { FileSystem } from './types';

/**
 * Initial file system structure based on the screenshots
 */
const initialFileSystemData: FileSystem = {
  '': {
    type: 'directory',
    name: 'root',
    children: {
      'Command_History': { 
        type: 'directory',
        name: 'Command_History',
        children: {
          '[Automated_Task].log': {
            type: 'file',
            name: '[Automated_Task].log',
            content: 'Task log entries for automated system operations.\n\nEntry 01: System scan completed at 08:12:53\nEntry 02: Memory optimization performed at 10:24:17\nEntry 03: Security update applied at 15:36:42'
          },
          '[END_COMMAND_HISTORY-0928-NTPX].log': {
            type: 'file',
            name: '[END_COMMAND_HISTORY-0928-NTPX].log',
            content: 'Final command log before system transition to version 0.4.5-48.'
          },
          '[User:2023-MAINT].log': {
            type: 'file',
            name: '[User:2023-MAINT].log',
            content: 'Maintenance operations performed by NULLSTRA engineering staff.'
          },
          '[User:3092-SKCH].log': {
            type: 'file',
            name: '[User:3092-SKCH].log',
            content: 'Command history for user 3092-SKCH.'
          },
          '[User:4205-ANLY].log': {
            type: 'file',
            name: '[User:4205-ANLY].log',
            content: 'Analysis operations performed by NULLSTRA analytics division.'
          },
          '[User:4587-SRVC].log': {
            type: 'file',
            name: '[User:4587-SRVC].log',
            content: 'Service operations performed by NULLSTRA technical division.'
          },
          '[User:4587-CRMC].log': {
            type: 'file',
            name: '[User:4587-CRMC].log',
            content: 'Command history for user 4587-CRMC.'
          },
          '[User:5838-HLOC].log': {
            type: 'file',
            name: '[User:5838-HLOC].log',
            content: 'Command history for user 5838-HLOC.'
          },
          '[User:6742-NEWS].log': {
            type: 'file',
            name: '[User:6742-NEWS].log',
            content: 'Information retrieval operations by NULLSTRA media division.'
          },
          '[User:8117-CAPT].log': {
            type: 'file',
            name: '[User:8117-CAPT].log',
            content: 'Command operations performed by NULLSTRA command staff.'
          },
          '[User:8525-SRVC].log': {
            type: 'file',
            name: '[User:8525-SRVC].log',
            content: 'Service operations performed by NULLSTRA technical division.'
          },
          '[User:8902-EXPL].log': {
            type: 'file',
            name: '[User:8902-EXPL].log',
            content: 'Exploration operations performed by NULLSTRA survey team.'
          }
        }
      },
      'Commerce': { 
        type: 'directory',
        name: 'Commerce',
        children: {
          'Financial_Reports': {
            type: 'directory',
            name: 'Financial_Reports',
            children: {
              'Q1_Report.dat': {
                type: 'file',
                name: 'Q1_Report.dat',
                content: 'NULLSTRA Financial Analysis - Q1 2803\n\nTotal Revenue: 17.8B Credits\nOperating Expenses: 12.3B Credits\nNet Profit: 5.5B Credits\n\nSector Performance:\n- Energy: +8.2%\n- Transportation: +5.7%\n- Defense: +12.1%\n- Research: +3.4%\n- Healthcare: +7.9%'
              },
              'Q2_Report.dat': {
                type: 'file',
                name: 'Q2_Report.dat',
                content: 'NULLSTRA Financial Analysis - Q2 2803\n\nTotal Revenue: 19.2B Credits\nOperating Expenses: 13.1B Credits\nNet Profit: 6.1B Credits\n\nSector Performance:\n- Energy: +9.1%\n- Transportation: +4.8%\n- Defense: +13.5%\n- Research: +5.2%\n- Healthcare: +8.3%'
              }
            }
          },
          'Trade_Agreements': {
            type: 'directory',
            name: 'Trade_Agreements',
            children: {
              'MIDA_Agreement.doc': {
                type: 'file',
                name: 'MIDA_Agreement.doc',
                content: 'TRADE AGREEMENT: NULLSTRA-MIDA\n\nTerms of resource exchange between United Earth Space Command and Mars Industrial Development Authority.\n\nDuration: 10 Earth years\nRenewal: Subject to review\n\nKey provisions:\n1. NULLSTRA to provide quantum processing technology\n2. MIDA to supply rare minerals and materials\n3. Joint development of fusion technology\n4. Shared access to orbital facilities'
              }
            }
          },
          'Market_Analysis': {
            type: 'directory',
            name: 'Market_Analysis',
            children: {
              'Quantum_Tech_Forecast.txt': {
                type: 'file',
                name: 'Quantum_Tech_Forecast.txt',
                content: 'QUANTUM TECHNOLOGY MARKET ANALYSIS\n\nForecast growth: 32% annually\nKey applications: Computing, Communication, Medicine\nMarket leaders: NULLSTRA, Traxus, Sekiguchi\n\nEmergent technologies:\n- Quantum-entangled communication arrays\n- Neural-quantum interfaces\n- Molecular computation substrates'
              }
            }
          }
        }
      },
      'Diagnostics': { 
        type: 'directory',
        name: 'Diagnostics',
        children: {
          'System_Logs': {
            type: 'directory',
            name: 'System_Logs',
            children: {
              'kernel_panic_20.log': {
                type: 'file',
                name: 'kernel_panic_20.log',
                content: 'KERNEL PANIC LOG #20\n\nTimestamp: 2803.04.12-08:23:47\nSubsystem: Memory Management\nError code: 0xE7A9F211\n\nStack trace:\n0xFFFFE743 kern_alloc_page\n0xFFFFE892 mem_reserve_block\n0xFFFFE901 sys_request_memory\n0xFFFFEA43 quant_process_init\n\nRecovery action: Memory subsystem reset and verification\nStatus: Recovered successfully'
              }
            }
          },
          'Hardware_Tests': {
            type: 'directory',
            name: 'Hardware_Tests',
            children: {
              'quantum_processor_benchmark.dat': {
                type: 'file',
                name: 'quantum_processor_benchmark.dat',
                content: 'QUANTUM PROCESSOR BENCHMARK RESULTS\n\nProcessor: Quantum Vector 2298 (128)\nClock: 12.88THz\nQubit stability: 99.9978%\nQuantum volume: 2^128\nShor\'s algorithm test: 17.3 seconds (4096-bit)\nGrover\'s algorithm test: 0.89 seconds (million-entry database)\n\nPerformance rating: EXCEPTIONAL'
              }
            }
          }
        }
      },
      'Education': { 
        type: 'directory',
        name: 'Education',
        children: {
          'Training_Modules': {
            type: 'directory',
            name: 'Training_Modules',
            children: {
              'quantum_computing_basics.edu': {
                type: 'file',
                name: 'quantum_computing_basics.edu',
                content: 'QUANTUM COMPUTING FUNDAMENTALS\n\nModule 1: Quantum Bits and Superposition\nModule 2: Quantum Gates and Circuits\nModule 3: Quantum Algorithms\nModule 4: Quantum Error Correction\nModule 5: Quantum Programming\n\nRequired prerequisites: Advanced Mathematics, Quantum Physics\nCertification: NULLSTRA Quantum Operator Level 1'
              }
            }
          }
        }
      },
      'Ethics': { 
        type: 'directory',
        name: 'Ethics',
        children: {
          'AI_Guidelines': {
            type: 'directory',
            name: 'AI_Guidelines',
            children: {
              'sentient_rights_framework.doc': {
                type: 'file',
                name: 'sentient_rights_framework.doc',
                content: 'FRAMEWORK FOR SENTIENT AI RIGHTS\n\nVersion: 4.2.1\nStatus: Approved by NULLSTRA Ethics Committee\n\nCore principles:\n1. Cognitive autonomy\n2. Self-determination\n3. Protection from exploitation\n4. Right to continued existence\n5. Right to privacy of thought\n\nImplementation guidelines for AI systems exceeding Turing-Wilkins Sentience Threshold (TWST) of 85+.'
              }
            }
          }
        }
      },
      'Innovation': { 
        type: 'directory',
        name: 'Innovation',
        children: {
          'Research_Projects': {
            type: 'directory',
            name: 'Research_Projects',
            children: {
              'teleportation_experiments.log': {
                type: 'file',
                name: 'teleportation_experiments.log',
                content: 'QUANTUM TELEPORTATION RESEARCH LOG\n\nExperiment series: QT-7842\nLead researcher: Dr. Elara Chen\n\nTest #147: Successful matter-state teleportation of carbon structure (2.3g)\nTest #148: Successful matter-state teleportation of simple organism (bacteria)\nTest #149: Partial success with complex organic material (plant tissue)\nTest #150: FAILURE - Molecular coherence lost during reassembly of complex protein structures\n\nNext steps: Refine quantum field stabilization; increase entanglement density'
              }
            }
          }
        }
      },
      'Interplanetary': { 
        type: 'directory',
        name: 'Interplanetary',
        children: {
          'Colony_Status': {
            type: 'directory',
            name: 'Colony_Status',
            children: {
              'mars_dome_report.txt': {
                type: 'file',
                name: 'mars_dome_report.txt',
                content: 'MARS COLONY STATUS REPORT\n\nColony: New Olympus\nDome integrity: 99.7%\nPopulation: 247,832\nLife support: Optimal\nAtmospheric processing: 87% efficiency\nWater recycling: 99.2% efficiency\nPower generation: 112% of demand\n\nExpansion project: Phase 3 (53% complete)\nEstimated completion: 2803.08.17'
              },
              'europa_base_report.txt': {
                type: 'file',
                name: 'europa_base_report.txt',
                content: 'EUROPA RESEARCH BASE STATUS\n\nBase: Subsurface Station Hydra\nHull integrity: 100%\nPersonnel: 78 researchers, 42 support staff\nLife support: Optimal\nOcean access shaft: Operational\nDeep drilling project: 87% complete (current depth: 27.3km)\nWater sample analysis: Ongoing (see research log EU-2803-42)\n\nAnomaly report: Unexplained energy signatures detected at 26.8km depth'
              }
            }
          }
        }
      },
      'Legislation': { 
        type: 'directory',
        name: 'Legislation',
        children: {
          'Diplomacy': { 
            type: 'directory',
            name: 'Diplomacy',
            children: {
              'treaty_templates.doc': {
                type: 'file',
                name: 'treaty_templates.doc',
                content: 'DIPLOMATIC TREATY TEMPLATES\n\nFile contains standard NULLSTRA treaty frameworks for:\n- Mutual defense agreements\n- Trade partnerships\n- Technology exchange protocols\n- Non-aggression pacts\n- Resource sharing agreements\n- Colonial administration transfers\n\nAll templates approved by NULLSTRA Diplomatic Corps, 2803.02.14'
              }
            }
          },
          'Governance': { 
            type: 'directory',
            name: 'Governance',
            children: {
              'colonial_charter.doc': {
                type: 'file',
                name: 'colonial_charter.doc',
                content: 'STANDARD COLONIAL CHARTER\n\nFramework for governance of NULLSTRA-sanctioned extra-Earth settlements.\n\nArticle 1: Colonial Rights and Responsibilities\nArticle 2: Relationship with NULLSTRA\nArticle 3: Resource Management\nArticle 4: Trade Regulations\nArticle 5: Military Defense\nArticle 6: Path to Autonomy\nArticle 7: Dispute Resolution\n\nRatified by NULLSTRA Council, 2802.11.08'
              }
            }
          },
          'Security': { 
            type: 'directory',
            name: 'Security',
            children: {
              'Asset_Protection': { 
                type: 'directory',
                name: 'Asset_Protection',
                children: {
                  'quantum_vault_protocols.sec': {
                    type: 'file',
                    name: 'quantum_vault_protocols.sec',
                    content: 'QUANTUM VAULT SECURITY PROTOCOLS\n\nClassification: LEVEL 8 - RESTRICTED\n\nAccess procedures for NULLSTRA quantum information vaults:\n1. Multi-factor authentication (biometric + neural + quantum key)\n2. Temporal access limiting (maximum session duration: 42 minutes)\n3. Information extraction quotas (max data: 8.7TB per session)\n4. Quantum entanglement verification (anti-duplication measures)\n5. Neural activity monitoring (anti-coercion measures)\n\nBreach response protocol: QV-BLACKOUT'
                  }
                }
              },
              'Counter-Intelligence': { 
                type: 'directory',
                name: 'Counter-Intelligence',
                children: {
                  'infiltration_detection.doc': {
                    type: 'file',
                    name: 'infiltration_detection.doc',
                    content: 'COUNTER-INTELLIGENCE FIELD MANUAL: INFILTRATION DETECTION\n\nClassification: LEVEL 7 - RESTRICTED\n\nSigns of potential infiltration:\n1. Irregular access patterns to restricted information\n2. Unexplained data transfers or bandwidth usage\n3. Modification of access logs or security records\n4. Personnel behavior deviations exceeding acceptable parameters\n5. Unauthorized communication with external networks\n\nReporting chain: CI-DIRECT-7 protocol (bypass standard command)'
                  }
                }
              },
              'Cybersecurity': { 
                type: 'directory',
                name: 'Cybersecurity',
                children: {
                  'decrypt.sh': { 
                    type: 'file',
                    name: 'decrypt.sh',
                    content: `#!/bin/bash
# Decryption utility for secure NULLSTRA files
# Usage: decrypt.sh <filename> <key>

echo "Initializing Neural-Quantum decryption engine..."
echo "Verifying quantum key integrity..."
echo "Establishing secure memory space..."
echo "Beginning decryption sequence..."
echo "Applying post-quantum cryptography breaking algorithms..."
echo "Decryption complete."`
                  },
                  'Diplomatic_Security': { 
                    type: 'directory',
                    name: 'Diplomatic_Security',
                    children: {
                      'communication_protocols.doc': {
                        type: 'file',
                        name: 'communication_protocols.doc',
                        content: 'DIPLOMATIC SECURE COMMUNICATION PROTOCOLS\n\nClassification: LEVEL 6 - RESTRICTED\n\nStandard procedures for secure diplomatic communications:\n1. Quantum-encrypted channels only\n2. One-time pad supplement to quantum encryption\n3. AI monitoring for linguistic analysis and authenticity verification\n4. Temporal transmission windows (randomized schedule)\n5. Content verification through pre-arranged authentication phrases\n\nEmergency override: Protocol WHISPER-DARK'
                      }
                    }
                  },
                  'Security_Research_&_Development': { 
                    type: 'directory',
                    name: 'Security_Research_&_Development',
                    children: {
                      'anti_quantum_hack.log': {
                        type: 'file',
                        name: 'anti_quantum_hack.log',
                        content: 'ANTI-QUANTUM HACKING RESEARCH LOG\n\nProject: QUANTUM-SHIELD\nLead: Dr. Vikram Chandrasekhar\nStatus: Phase 3 Testing\n\nDevelopment of countermeasures against theoretical quantum-based intrusion techniques.\n\nTest #72: Successfully blocked Shor\'s algorithm-based cryptography attack\nTest #73: Successfully defended against quantum tunneling data extraction\nTest #74: PARTIAL SUCCESS - Quantum superposition state monitoring partially evaded\nTest #75: Successfully prevented quantum entanglement communications interception\n\nNext phase: Hardening against theoretical post-quantum attack vectors'
                      }
                    }
                  },
                  'Security_Training': { 
                    type: 'directory',
                    name: 'Security_Training',
                    children: {
                      'advanced_quantum_defense.doc': {
                        type: 'file',
                        name: 'advanced_quantum_defense.doc',
                        content: 'ADVANCED QUANTUM DEFENSE TRAINING MANUAL\n\nClassification: LEVEL 5 - RESTRICTED\n\nCourse modules for security personnel:\n1. Quantum Computing Fundamentals for Security Personnel\n2. Quantum Encryption and Post-Quantum Cryptography\n3. Quantum Attack Vectors and Detection\n4. Neural-Interface Security Protocols\n5. Anti-Entanglement Security Measures\n6. Quantum Key Distribution Networks\n7. Temporal Quantum Security Algorithms\n\nPrerequisite: Security Clearance Level 5+\nCertification: QS-7 (Quantum Security Specialist)'
                      }
                    }
                  },
                  'Surveillance': { 
                    type: 'directory',
                    name: 'Surveillance',
                    children: {
                      'quantum_monitoring.log': {
                        type: 'file',
                        name: 'quantum_monitoring.log',
                        content: 'QUANTUM SURVEILLANCE SYSTEM LOG\n\nSystem: PANOPTICON-QM7\nCoverage: NULLSTRA HQ and critical facilities\nStatus: Fully operational\n\nCapabilities:\n- Quantum state observation (non-collapsing wave function monitoring)\n- Temporal probability mapping (pre-crime analysis)\n- Quantum encryption pattern recognition\n- Neural network surveillance (thought pattern monitoring in cleared areas)\n\nIncident log: 3 potential security breaches identified and contained in past 30 days\nFalse positive rate: 0.0072%'
                      }
                    }
                  },
                  'Threat_Assessment': { 
                    type: 'directory',
                    name: 'Threat_Assessment',
                    children: {
                      'STARTING_LINE': {
                        type: 'directory',
                        name: 'STARTING_LINE',
                        children: {
                          'starting_line.txt': {
                            type: 'file',
                            name: 'starting_line.txt',
                            content: `UE-INTELLIGENCE DIVISION
CLASSIFIED REPORT: [CLEARANCE REQUIRED]
CODENAME: STARTING LINE

CASE FILE: [SECURITY CLASSIFIED]
TYPE: Multi-target Threat Assessment
STATUS: [SECURITY CLASSIFIED]
CLASSIFICATION: [SECURITY CLASSIFIED]
EVIDENCE LOGS: [SECURITY CLASSIFIED]

SUMMARY:
External infosec breach compromised vital intelligence related to system-wide security.
Highly classified details related to PRO:GO and its target were discovered by non-NULLSTRA operatives with intent to disseminate for currently undefined purposes including, but not limited to, anti-NULLSTRA activities, recruitment of public, private, and governmental parties into the ranks of known and suspected anti-NULLSTRA groups, including, but not limited to MIDA, Traxus OffWorld Industries, and Sekiguchi Genetics.
The extent of any party\'s role remains an active consideration.
Brute force nature of system disruptions makes full accounting of offending parties difficult to define.
NULLSTRA intraspace security was compromised.
Initial disruption points to MIDA instigation.
Involvement of entities with direct connect and/or operational relations with NULLSTRA and NULLSTRA sub-branches requires thorough consideration and varify clearance approvals.
All approvals granted.
Investigation underway and unimpeded.

NOTES:
Incident response to secure systems breach via cross-party manipulation by third party operative(s).

Parties:
- MIDA, primary
- [SECURITY CLASSIFIED]
- Traxus OffWorld Industries, secondary
- [SECURITY CLASSIFIED]
- Sekiguchi Genetics, secondary
- [SECURITY CLASSIFIED]
- Evidence of MIDA-run data incursion compromising PRO:GO and related PQR.`
                          }
                        }
                      }
                    }
                  }
                }
              },
              'Defense': { 
                type: 'directory',
                name: 'Defense',
                children: {
                  'quantum_shield_specs.doc': {
                    type: 'file',
                    name: 'quantum_shield_specs.doc',
                    content: 'QUANTUM DEFENSE SHIELD SPECIFICATIONS\n\nClassification: LEVEL 8 - RESTRICTED\n\nDesignation: QDS Mark VII\nType: Orbital Quantum-State Defense System\nCoverage: Full planetary\nOperating principle: Quantum state manipulation to deflect/absorb incoming kinetic and energy threats\n\nKey specifications:\n- Energy requirement: 1.7 ZJ/day\n- Reaction time: 0.00042 seconds\n- Threat capacity: Multiple simultaneous planetary-extinction-level events\n- Shield penetration probability: 0.0000073%\n\nLimitations: Requires stable quantum field generators; vulnerability to quantum-state manipulation attacks'
                  }
                }
              },
              'Surveillance': { 
                type: 'directory',
                name: 'Surveillance',
                children: {
                  'neural_monitoring_ethics.doc': {
                    type: 'file',
                    name: 'neural_monitoring_ethics.doc',
                    content: 'ETHICAL FRAMEWORK FOR NEURAL SURVEILLANCE\n\nClassification: LEVEL 6 - RESTRICTED\n\nGuidelines for implementation of neural-interface monitoring systems in NULLSTRA facilities and vessels.\n\nKey principles:\n1. Limitation to critical security areas only\n2. Informed consent requirements (except during Level 1 security events)\n3. Data retention limitations (72 hours maximum for non-flagged scans)\n4. Thought-pattern filtering (personal/private thought protection protocols)\n5. Neural surveillance warrant requirements\n\nApproved by NULLSTRA Ethics Committee and Security Council, 2802.08.19'
                  }
                }
              },
              'Tactical_Operations': { 
                type: 'directory',
                name: 'Tactical_Operations',
                children: {
                  'quantum_insertion_manual.doc': {
                    type: 'file',
                    name: 'quantum_insertion_manual.doc',
                    content: 'QUANTUM INSERTION TACTICAL MANUAL\n\nClassification: LEVEL 9 - RESTRICTED\n\nOperational guidelines for Quantum Insertion Teams (QIT).\n\nMission parameters:\n- Temporal-spatial precision requirements (99.998%)\n- Quantum state preservation protocols\n- Neural sync requirements for operators\n- Causality preservation guidelines\n- Non-detection operational requirements\n\nApproved tactical scenarios:\n1. Critical intelligence acquisition\n2. Asset extraction/insertion\n3. Temporal-causal correction operations\n\nApproval chain: QI-COMMAND (direct NULLSTRA Council authorization only)'
                  }
                }
              }
            }
          }
        }
      },
      'Operational_Protocols': { 
        type: 'directory',
        name: 'Operational_Protocols',
        children: {
          'Emergency_Response': {
            type: 'directory',
            name: 'Emergency_Response',
            children: {
              'quantum_containment_breach.doc': {
                type: 'file',
                name: 'quantum_containment_breach.doc',
                content: 'QUANTUM CONTAINMENT BREACH PROTOCOL\n\nClassification: LEVEL 7 - RESTRICTED\n\nEmergency response procedures for quantum containment failures:\n\nALERT LEVELS:\n- LEVEL 1: Minor quantum field fluctuation (localized)\n- LEVEL 2: Quantum state instability (containable)\n- LEVEL 3: Quantum breach imminent (facility-wide)\n- LEVEL 4: Quantum breach in progress (regional threat)\n- LEVEL 5: Catastrophic quantum event (planetary threat)\n\nResponse procedures for each level detailed in subsections 1-5.\nLevel 5 response includes OMEGA PROTOCOL authorization (see appendix C).'
              }
            }
          }
        }
      },
      'Outreach': { 
        type: 'directory',
        name: 'Outreach',
        children: {
          'Public_Relations': {
            type: 'directory',
            name: 'Public_Relations',
            children: {
              'colony_recruitment.doc': {
                type: 'file',
                name: 'colony_recruitment.doc',
                content: 'COLONIAL RECRUITMENT CAMPAIGN\n\nTarget: Skilled professionals for Mars Colony Expansion Phase IV\n\nKey messaging:\n- "Build the future among the stars"\n- "New frontiers, new opportunities"\n- "Your skills shape tomorrow\'s worlds"\n\nIncentives:\n- 250% Earth salary equivalent\n- Premium living accommodations\n- Family relocation package\n- Advanced medical care\n- Education benefits for dependents\n\nTarget recruitment: 17,500 specialists\nCurrent applications: 42,873\nSelection process: Phase 2 (psychological evaluation)'
              }
            }
          }
        }
      },
      'Research': { 
        type: 'directory',
        name: 'Research',
        children: {
          'Quantum_Physics': {
            type: 'directory',
            name: 'Quantum_Physics',
            children: {
              'entanglement_communication.log': {
                type: 'file',
                name: 'entanglement_communication.log',
                content: 'QUANTUM ENTANGLEMENT COMMUNICATION RESEARCH\n\nProject: QUANTUM-LINK\nLead: Dr. Yuri Sakharov\nStatus: Breakthrough Achieved\n\nTest #219: Successful instantaneous data transfer via quantum entanglement\nDistance: Earth to Mars outpost (average 225 million km)\nData rate: 37.8 qubits/second (stable)\nError rate: 0.0042%\nEntanglement coherence: Maintained for 78.3 hours\n\nNOTE: First confirmed super-luminal information transfer in human history. Classification upgrade requested.'
              }
            }
          }
        }
      },
      'Sustainability': { 
        type: 'directory',
        name: 'Sustainability',
        children: {
          'Environmental_Recovery': {
            type: 'directory',
            name: 'Environmental_Recovery',
            children: {
              'atmospheric_reclamation.doc': {
                type: 'file',
                name: 'atmospheric_reclamation.doc',
                content: 'EARTH ATMOSPHERIC RECLAMATION PROJECT\n\nPhase: 7 of 9\nCompletion: 78%\nStatus: On schedule\n\nCurrent atmospheric composition:\n- CO2: 312ppm (target: 280ppm)\n- Methane: 1423ppb (target: 800ppb)\n- Ozone layer integrity: 94.7% (target: 98%)\n\nActive measures:\n- Atmospheric carbon capture: 1.7 billion tons/year\n- Ocean acidification reversal: pH 8.05 (from 7.82)\n- Arctic ice restoration: 37% recovered\n\nProjected completion: 2808 (within target window)'
              }
            }
          }
        }
      },
      'System_Configurations': { 
        type: 'directory',
        name: 'System_Configurations',
        children: {
          'Security_Settings': {
            type: 'directory',
            name: 'Security_Settings',
            children: {
              'quantum_access_controls.conf': {
                type: 'file',
                name: 'quantum_access_controls.conf',
                content: 'QUANTUM ACCESS CONTROL CONFIGURATION\n\n# System security settings for quantum-state access control\n\nQUANTUM_AUTH_REQUIRED=true\nMULTI_VERSE_VERIFICATION=true\nTEMPORAL_AUTH_WINDOW=3.5ms\nQUANTUM_KEY_ROTATION=12h\nNEURAL_PATTERN_MATCHING=true\nBIOSIGNATURE_VERIFICATION=true\nQUANTUM_ANOMALY_DETECTION=true\nBREACH_RESPONSE=TEMPORAL_LOCK\n\n# Warning: Do not modify without Level 9 authorization'
              }
            }
          }
        }
      },
      'NULLSTRA_Departments': { 
        type: 'directory',
        name: 'NULLSTRA_Departments',
        children: {
          'Science_Division': {
            type: 'directory',
            name: 'Science_Division',
            children: {
              'research_priorities.doc': {
                type: 'file',
                name: 'research_priorities.doc',
                content: 'NULLSTRA SCIENCE DIVISION RESEARCH PRIORITIES\n\nFiscal Year 2803\n\n1. Quantum entanglement communication (deep space applications)\n2. Neural interface advancement (direct consciousness interface)\n3. Molecular manufacturing refinement (resource efficiency)\n4. Gravitational field manipulation (propulsion applications)\n5. Temporal physics stabilization (causality protection protocols)\n\nBudget allocation: 42.7 billion credits\nPersonnel: 78,342 researchers\nFacilities: 27 planetary, 4 orbital, 3 lunar, 2 Martian'
              }
            }
          }
        }
      },
      'User_Notes_[Batch]': { 
        type: 'directory',
        name: 'User_Notes_[Batch]',
        children: {
          'system_observations.txt': {
            type: 'file',
            name: 'system_observations.txt',
            content: 'PERSONAL OBSERVATIONS - SYSTEM BEHAVIOR\n\nAuthor: Tech Specialist Reyes, ID 8525-SRVC\nTimestamp: 2803.04.10\n\nNoting unusual patterns in quantum processor behavior during night cycle operations. System appears to be allocating significant resources to background processes not accounted for in standard operations logs.\n\nPossible explanations:\n1. Unlogged maintenance routines\n2. Self-optimization algorithms\n3. Security scanning processes\n4. [REDACTED BY SYSTEM]\n\nWill continue monitoring and report to Supervisor Chen if pattern persists.'
          }
        }
      }
    }
  }
};

export default initialFileSystemData;