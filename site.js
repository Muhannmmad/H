        /* =========================
           UTILITY
        ========================= */
        function shuffle(array) {
          return array.sort(() => Math.random() - 0.5);
        }

        let currentLang = localStorage.getItem("lang") || "de";

        function updateDirection() {
          document.body.dir = currentLang === "ar" ? "rtl" : "ltr";
        }

        const messages = {
          correct: { en:"✔ Correct!", de:"✔ Richtig!", ar:"✔ إجابة صحيحة!" },
          wrong: { en:"✘ Wrong!", de:"✘ Falsch!", ar:"✘ إجابة خاطئة!" }
        };

        /* ===== FLAGS DATA ===== */
        const flags = [
          { code:"af", nameEn:"Afghanistan",                 nameDe:"Afghanistan",                    nameAr:"أفغانستان" },
          { code:"al", nameEn:"Albania",                     nameDe:"Albanien",                      nameAr:"ألبانيا" },
          { code:"dz", nameEn:"Algeria",                     nameDe:"Algerien",                      nameAr:"الجزائر" },
          { code:"ad", nameEn:"Andorra",                     nameDe:"Andorra",                       nameAr:"أندورا" },
          { code:"ao", nameEn:"Angola",                      nameDe:"Angola",                        nameAr:"أنغولا" },
          { code:"ag", nameEn:"Antigua and Barbuda",         nameDe:"Antigua und Barbuda",           nameAr:"أنتيغوا وباربودا" },
          { code:"ar", nameEn:"Argentina",                   nameDe:"Argentinien",                   nameAr:"الأرجنتين" },
          { code:"am", nameEn:"Armenia",                     nameDe:"Armenien",                      nameAr:"أرمينيا" },
          { code:"au", nameEn:"Australia",                   nameDe:"Australien",                    nameAr:"أستراليا" },
          { code:"at", nameEn:"Austria",                     nameDe:"Österreich",                    nameAr:"النمسا" },
          { code:"az", nameEn:"Azerbaijan",                  nameDe:"Aserbaidschan",                 nameAr:"أذربيجان" },
          { code:"bs", nameEn:"Bahamas",                     nameDe:"Bahamas",                       nameAr:"الباهاماس" },
          { code:"bh", nameEn:"Bahrain",                     nameDe:"Bahrain",                       nameAr:"البحرين" },
          { code:"bd", nameEn:"Bangladesh",                  nameDe:"Bangladesch",                   nameAr:"بنغلاديش" },
          { code:"bb", nameEn:"Barbados",                    nameDe:"Barbados",                      nameAr:"بربادوس" },
          { code:"by", nameEn:"Belarus",                     nameDe:"Belarus",                       nameAr:"روسيا البيضاء" },
          { code:"be", nameEn:"Belgium",                     nameDe:"Belgien",                       nameAr:"بلجيكا" },
          { code:"bz", nameEn:"Belize",                      nameDe:"Belize",                        nameAr:"بليز" },
          { code:"bj", nameEn:"Benin",                       nameDe:"Benin",                         nameAr:"بنين" },
          { code:"bt", nameEn:"Bhutan",                      nameDe:"Bhutan",                        nameAr:"بوتان" },
          { code:"bo", nameEn:"Bolivia",                     nameDe:"Bolivien",                      nameAr:"بوليفيا" },
          { code:"ba", nameEn:"Bosnia and Herzegovina",       nameDe:"Bosnien und Herzegowina",       nameAr:"البوسنة والهرسك" },
          { code:"bw", nameEn:"Botswana",                    nameDe:"Botswana",                      nameAr:"بوتسوانا" },
          { code:"br", nameEn:"Brazil",                      nameDe:"Brasilien",                     nameAr:"البرازيل" },
          { code:"bn", nameEn:"Brunei",                      nameDe:"Brunei",                        nameAr:"بروناي" },
          { code:"bg", nameEn:"Bulgaria",                    nameDe:"Bulgarien",                     nameAr:"بلغاريا" },
          { code:"bf", nameEn:"Burkina Faso",                nameDe:"Burkina Faso",                  nameAr:"بوركينا فاسو" },
          { code:"bi", nameEn:"Burundi",                     nameDe:"Burundi",                       nameAr:"بوروندي" },
          { code:"cv", nameEn:"Cabo Verde",                  nameDe:"Kap Verde",                     nameAr:"الرأس الأخضر" },
          { code:"kh", nameEn:"Cambodia",                    nameDe:"Kambodscha",                    nameAr:"كمبوديا" },
          { code:"cm", nameEn:"Cameroon",                    nameDe:"Kamerun",                       nameAr:"الكاميرون" },
          { code:"ca", nameEn:"Canada",                      nameDe:"Kanada",                        nameAr:"كندا" },
          { code:"cf", nameEn:"Central African Republic",     nameDe:"Zentralafrikanische Republik",  nameAr:"جمهورية أفريقيا الوسطى" },
          { code:"td", nameEn:"Chad",                        nameDe:"Tschad",                        nameAr:"تشاد" },
          { code:"cl", nameEn:"Chile",                       nameDe:"Chile",                         nameAr:"تشيلي" },
          { code:"cn", nameEn:"China",                       nameDe:"China",                         nameAr:"الصين" },
          { code:"co", nameEn:"Colombia",                    nameDe:"Kolumbien",                     nameAr:"كولومبيا" },
          { code:"km", nameEn:"Comoros",                     nameDe:"Komoren",                       nameAr:"جزر القمر" },
          { code:"cd", nameEn:"Congo (DRC)",                 nameDe:"Kongo (Demokratische Republik)",nameAr:"جمهورية الكونغو الديمقراطية" },
          { code:"cg", nameEn:"Congo (Republic)",            nameDe:"Kongo (Republik)",              nameAr:"الكونغو" },
          { code:"cr", nameEn:"Costa Rica",                  nameDe:"Costa Rica",                    nameAr:"كوستاريكا" },
          { code:"hr", nameEn:"Croatia",                     nameDe:"Kroatien",                      nameAr:"كرواتيا" },
          { code:"cu", nameEn:"Cuba",                        nameDe:"Kuba",                          nameAr:"كوبا" },
          { code:"cy", nameEn:"Cyprus",                      nameDe:"Zypern",                        nameAr:"قبرص" },
          { code:"cz", nameEn:"Czech Republic",              nameDe:"Tschechien",                    nameAr:"التشيك" },
          { code:"dk", nameEn:"Denmark",                     nameDe:"Dänemark",                      nameAr:"الدنمارك" },
          { code:"dj", nameEn:"Djibouti",                    nameDe:"Dschibuti",                     nameAr:"جيبوتي" },
          { code:"dm", nameEn:"Dominica",                    nameDe:"Dominica",                      nameAr:"دومينيكا" },
          { code:"do", nameEn:"Dominican Republic",          nameDe:"Dominikanische Republik",       nameAr:"جمهورية الدومينيكان" },
          { code:"ec", nameEn:"Ecuador",                     nameDe:"Ecuador",                       nameAr:"الإكوادور" },
          { code:"eg", nameEn:"Egypt",                       nameDe:"Ägypten",                       nameAr:"مصر" },
          { code:"sv", nameEn:"El Salvador",                 nameDe:"El Salvador",                   nameAr:"السلفادور" },
          { code:"gq", nameEn:"Equatorial Guinea",           nameDe:"Äquatorialguinea",              nameAr:"غينيا الاستوائية" },
          { code:"er", nameEn:"Eritrea",                     nameDe:"Eritrea",                       nameAr:"إريتريا" },
          { code:"ee", nameEn:"Estonia",                     nameDe:"Estland",                       nameAr:"إستونيا" },
          { code:"sz", nameEn:"Eswatini",                    nameDe:"Eswatini",                      nameAr:"إسواتيني" },
          { code:"et", nameEn:"Ethiopia",                    nameDe:"Äthiopien",                     nameAr:"إثيوبيا" },
          { code:"fj", nameEn:"Fiji",                        nameDe:"Fidschi",                       nameAr:"فيجي" },
          { code:"fi", nameEn:"Finland",                     nameDe:"Finnland",                      nameAr:"فنلندا" },
          { code:"fr", nameEn:"France",                      nameDe:"Frankreich",                     nameAr:"فرنسا" },
          { code:"ga", nameEn:"Gabon",                       nameDe:"Gabun",                         nameAr:"الغابون" },
          { code:"gm", nameEn:"Gambia",                      nameDe:"Gambia",                        nameAr:"غامبيا" },
          { code:"ge", nameEn:"Georgia",                     nameDe:"Georgien",                      nameAr:"جورجيا" },
          { code:"de", nameEn:"Germany",                     nameDe:"Deutschland",                   nameAr:"ألمانيا" },
          { code:"gh", nameEn:"Ghana",                       nameDe:"Ghana",                         nameAr:"غانا" },
          { code:"gr", nameEn:"Greece",                      nameDe:"Griechenland",                  nameAr:"اليونان" },
          { code:"gd", nameEn:"Grenada",                     nameDe:"Grenada",                       nameAr:"غرينادا" },
          { code:"gt", nameEn:"Guatemala",                   nameDe:"Guatemala",                     nameAr:"غواتيمالا" },
          { code:"gn", nameEn:"Guinea",                      nameDe:"Guinea",                        nameAr:"غينيا" },
          { code:"gw", nameEn:"Guinea‑Bissau",               nameDe:"Guinea‑Bissau",                 nameAr:"غينيا بيساو" },
          { code:"gy", nameEn:"Guyana",                      nameDe:"Guyana",                        nameAr:"غيانا" },
          { code:"ht", nameEn:"Haiti",                       nameDe:"Haiti",                         nameAr:"هايتي" },
          { code:"hn", nameEn:"Honduras",                    nameDe:"Honduras",                      nameAr:"هندوراس" },
          { code:"hu", nameEn:"Hungary",                     nameDe:"Ungarn",                        nameAr:"المجر" },
          { code:"is", nameEn:"Iceland",                     nameDe:"Island",                        nameAr:"آيسلندا" },
          { code:"in", nameEn:"India",                       nameDe:"Indien",                        nameAr:"الهند" },
          { code:"id", nameEn:"Indonesia",                   nameDe:"Indonesien",                    nameAr:"إندونيسيا" },
          { code:"ir", nameEn:"Iran",                        nameDe:"Iran",                          nameAr:"إيران" },
          { code:"iq", nameEn:"Iraq",                        nameDe:"Irak",                          nameAr:"العراق" },
          { code:"ie", nameEn:"Ireland",                     nameDe:"Irland",                        nameAr:"أيرلندا" },
         { code:"ps", nameEn:"Palestine", nameDe:"Palästina", nameAr:"فلسطين" },

          { code:"it", nameEn:"Italy",                       nameDe:"Italien",                       nameAr:"إيطاليا" },
          { code:"jm", nameEn:"Jamaica",                     nameDe:"Jamaika",                       nameAr:"جامايكا" },
          { code:"jp", nameEn:"Japan",                       nameDe:"Japan",                         nameAr:"اليابان" },
          { code:"jo", nameEn:"Jordan",                      nameDe:"Jordanien",                     nameAr:"الأردن" },
          { code:"kz", nameEn:"Kazakhstan",                  nameDe:"Kasachstan",                    nameAr:"كازاخستان" },
          { code:"ke", nameEn:"Kenya",                       nameDe:"Kenia",                         nameAr:"كينيا" },
          { code:"ki", nameEn:"Kiribati",                    nameDe:"Kiribati",                      nameAr:"كيريباتي" },
          { code:"kw", nameEn:"Kuwait",                      nameDe:"Kuwait",                        nameAr:"الكويت" },
          { code:"kg", nameEn:"Kyrgyzstan",                  nameDe:"Kirgistan",                     nameAr:"قيرغيزستان" },
          { code:"la", nameEn:"Laos",                        nameDe:"Laos",                          nameAr:"لاوس" },
          { code:"lv", nameEn:"Latvia",                      nameDe:"Lettland",                      nameAr:"لاتفيا" },
          { code:"lb", nameEn:"Lebanon",                     nameDe:"Libanon",                       nameAr:"لبنان" },
          { code:"ls", nameEn:"Lesotho",                     nameDe:"Lesotho",                       nameAr:"ليسوتو" },
          { code:"lr", nameEn:"Liberia",                     nameDe:"Liberia",                       nameAr:"ليبيريا" },
          { code:"ly", nameEn:"Libya",                       nameDe:"Libyen",                        nameAr:"ليبيا" },
          { code:"li", nameEn:"Liechtenstein",               nameDe:"Liechtenstein",                  nameAr:"ليختنشتاين" },
          { code:"lt", nameEn:"Lithuania",                   nameDe:"Litauen",                       nameAr:"ليتوانيا" },
          { code:"lu", nameEn:"Luxembourg",                  nameDe:"Luxemburg",                     nameAr:"لوكسمبورغ" },
          { code:"mg", nameEn:"Madagascar",                  nameDe:"Madagaskar",                    nameAr:"مدغشقر" },
          { code:"mw", nameEn:"Malawi",                      nameDe:"Malawi",                        nameAr:"مالاوي" },
          { code:"my", nameEn:"Malaysia",                    nameDe:"Malaysia",                      nameAr:"ماليزيا" },
                       { code:"mv", nameEn:"Maldives",                    nameDe:"Malediven",                     nameAr:"جزر المالديف" },
                       { code:"ml", nameEn:"Mali",                        nameDe:"Mali",                           nameAr:"مالي" },
                       { code:"mt", nameEn:"Malta",                       nameDe:"Malta",                          nameAr:"مالطا" },
                       { code:"mh", nameEn:"Marshall Islands",            nameDe:"Marshallinseln",                 nameAr:"جزر مارشال" },
                       { code:"mr", nameEn:"Mauritania",                  nameDe:"Mauretanien",                    nameAr:"موريتانيا" },
                       { code:"mu", nameEn:"Mauritius",                   nameDe:"Mauritius",                      nameAr:"موريشيوس" },
                       { code:"mx", nameEn:"Mexico",                      nameDe:"Mexiko",                         nameAr:"المكسيك" },
                       { code:"fm", nameEn:"Micronesia",                  nameDe:"Mikronesien",                    nameAr:"ميكرونيسيا" },
                       { code:"md", nameEn:"Moldova",                     nameDe:"Moldawien",                      nameAr:"مولدوفا" },
                       { code:"mc", nameEn:"Monaco",                      nameDe:"Monaco",                         nameAr:"موناكو" },
                       { code:"mn", nameEn:"Mongolia",                    nameDe:"Mongolei",                       nameAr:"منغوليا" },
                       { code:"me", nameEn:"Montenegro",                  nameDe:"Montenegro",                      nameAr:"الجبل الأسود" },
                       { code:"ma", nameEn:"Morocco",                     nameDe:"Marokko",                        nameAr:"المغرب" },
                       { code:"mz", nameEn:"Mozambique",                  nameDe:"Mosambik",                       nameAr:"موزمبيق" },
                       { code:"mm", nameEn:"Myanmar",                     nameDe:"Myanmar",                         nameAr:"ميانمار" },
                       { code:"na", nameEn:"Namibia",                     nameDe:"Namibia",                         nameAr:"ناميبيا" },
                       { code:"nr", nameEn:"Nauru",                       nameDe:"Nauru",                           nameAr:"ناورو" },
                       { code:"np", nameEn:"Nepal",                       nameDe:"Nepal",                           nameAr:"نيبال" },
                       { code:"nl", nameEn:"Netherlands",                 nameDe:"Niederlande",                     nameAr:"هولندا" },
                       { code:"nz", nameEn:"New Zealand",                 nameDe:"Neuseeland",                      nameAr:"نيوزيلندا" },
                       { code:"ni", nameEn:"Nicaragua",                   nameDe:"Nicaragua",                        nameAr:"نيكاراغوا" },
                       { code:"ne", nameEn:"Niger",                       nameDe:"Niger",                            nameAr:"النيجر" },
                       { code:"ng", nameEn:"Nigeria",                     nameDe:"Nigeria",                          nameAr:"نيجيريا" },
                       { code:"kp", nameEn:"North Korea",                 nameDe:"Nordkorea",                        nameAr:"كوريا الشمالية" },
                       { code:"mk", nameEn:"North Macedonia",             nameDe:"Nordmazedonien",                   nameAr:"مقدونيا الشمالية" },
                       { code:"no", nameEn:"Norway",                      nameDe:"Norwegen",                         nameAr:"النرويج" },
                       { code:"om", nameEn:"Oman",                        nameDe:"Oman",                             nameAr:"عمان" },
                       { code:"pk", nameEn:"Pakistan",                    nameDe:"Pakistan",                         nameAr:"باكستان" },
                       { code:"pw", nameEn:"Palau",                       nameDe:"Palau",                            nameAr:"بالاو" },
                       { code:"ps", nameEn:"Palestine",                   nameDe:"Palästina",                        nameAr:"فلسطين" },
                       { code:"pa", nameEn:"Panama",                      nameDe:"Panama",                           nameAr:"بنما" },
                       { code:"pg", nameEn:"Papua New Guinea",            nameDe:"Papua-Neuguinea",                  nameAr:"بابوا غينيا الجديدة" },
                       { code:"py", nameEn:"Paraguay",                    nameDe:"Paraguay",                         nameAr:"باراغواي" },
                       { code:"pe", nameEn:"Peru",                        nameDe:"Peru",                             nameAr:"بيرو" },
                       { code:"ph", nameEn:"Philippines",                 nameDe:"Philippinen",                      nameAr:"الفلبين" },
                       { code:"pl", nameEn:"Poland",                      nameDe:"Polen",                            nameAr:"بولندا" },
                       { code:"pt", nameEn:"Portugal",                    nameDe:"Portugal",                         nameAr:"البرتغال" },
                       { code:"qa", nameEn:"Qatar",                       nameDe:"Katar",                            nameAr:"قطر" },
                       { code:"ro", nameEn:"Romania",                     nameDe:"Rumänien",                          nameAr:"رومانيا" },
                       { code:"ru", nameEn:"Russia",                      nameDe:"Russland",                           nameAr:"روسيا" },
                       { code:"rw", nameEn:"Rwanda",                      nameDe:"Ruanda",                            nameAr:"رواندا" },
                       { code:"kn", nameEn:"Saint Kitts and Nevis",       nameDe:"St. Kitts und Nevis",               nameAr:"سانت كيتس ونيفيس" },
                       { code:"lc", nameEn:"Saint Lucia",                 nameDe:"St. Lucia",                          nameAr:"سانت لوسيا" },
                       { code:"vc", nameEn:"Saint Vincent and the Grenadines", nameDe:"St. Vincent und die Grenadinen", nameAr:"سانت فنسنت والغرينادين" },
                       { code:"ws", nameEn:"Samoa",                       nameDe:"Samoa",                             nameAr:"ساموا" },
                       { code:"sm", nameEn:"San Marino",                  nameDe:"San Marino",                        nameAr:"سان مارينو" },
                       { code:"st", nameEn:"Sao Tome and Principe",       nameDe:"São Tomé und Príncipe",             nameAr:"ساو تومي وبرينسيبي" },
                       { code:"sa", nameEn:"Saudi Arabia",                nameDe:"Saudi-Arabien",                     nameAr:"المملكة العربية السعودية" },
                       { code:"sn", nameEn:"Senegal",                     nameDe:"Senegal",                            nameAr:"السنغال" },
                       { code:"rs", nameEn:"Serbia",                      nameDe:"Serbien",                            nameAr:"صربيا" },
                       { code:"sc", nameEn:"Seychelles",                  nameDe:"Seychellen",                         nameAr:"سيشيل" },
                       { code:"sl", nameEn:"Sierra Leone",                nameDe:"Sierra Leone",                        nameAr:"سيراليون" },
                       { code:"sg", nameEn:"Singapore",                   nameDe:"Singapur",                            nameAr:"سنغافورة" },
                       { code:"sk", nameEn:"Slovakia",                    nameDe:"Slowakei",                            nameAr:"سلوفاكيا" },
                       { code:"si", nameEn:"Slovenia",                    nameDe:"Slowenien",                           nameAr:"سلوفينيا" },
                       { code:"sb", nameEn:"Solomon Islands",             nameDe:"Salomonen",                           nameAr:"جزر سليمان" },
                       { code:"so", nameEn:"Somalia",                     nameDe:"Somalia",                              nameAr:"الصومال" },
                       { code:"za", nameEn:"South Africa",                nameDe:"Südafrika",                            nameAr:"جنوب أفريقيا" },
                       { code:"kr", nameEn:"South Korea",                 nameDe:"Südkorea",                              nameAr:"كوريا الجنوبية" },
                       { code:"ss", nameEn:"South Sudan",                 nameDe:"Südsudan",                              nameAr:"جنوب السودان" },
                       { code:"es", nameEn:"Spain",                       nameDe:"Spanien",                               nameAr:"إسبانيا" },
                       { code:"lk", nameEn:"Sri Lanka",                   nameDe:"Sri Lanka",                             nameAr:"سريلانكا" },
                       { code:"sd", nameEn:"Sudan",                       nameDe:"Sudan",                                  nameAr:"السودان" },
                       { code:"sr", nameEn:"Suriname",                    nameDe:"Suriname",                               nameAr:"سورينام" },
                       { code:"se", nameEn:"Sweden",                      nameDe:"Schweden",                               nameAr:"السويد" },
                       { code:"ch", nameEn:"Switzerland",                 nameDe:"Schweiz",                                nameAr:"سويسرا" },
                       { code:"sy", nameEn:"Syria",                        nameDe:"Syrien",                                nameAr:"سوريا" },
                       { code:"tw", nameEn:"Taiwan",                       nameDe:"Taiwan",                                nameAr:"تايوان" },
                       { code:"tj", nameEn:"Tajikistan",                   nameDe:"Tadschikistan",                        nameAr:"طاجيكستان" },
                       { code:"tz", nameEn:"Tanzania",                     nameDe:"Tansania",                              nameAr:"تنزانيا" },
                       { code:"th", nameEn:"Thailand",                     nameDe:"Thailand",                              nameAr:"تايلاند" },
                       { code:"tl", nameEn:"Timor‑Leste",                  nameDe:"Osttimor",                              nameAr:"تيمور الشرقية" },
                       { code:"tg", nameEn:"Togo",                         nameDe:"Togo",                                   nameAr:"توغو" },
                       { code:"to", nameEn:"Tonga",                        nameDe:"Tonga",                                  nameAr:"تونغا" },
                       { code:"tt", nameEn:"Trinidad and Tobago",          nameDe:"Trinidad und Tobago",                    nameAr:"ترينيداد وتوباغو" },
                       { code:"tn", nameEn:"Tunisia",                      nameDe:"Tunesien",                               nameAr:"تونس" },
                       { code:"tr", nameEn:"Turkey",                       nameDe:"Türkei",                                 nameAr:"تركيا" },
                       { code:"tm", nameEn:"Turkmenistan",                 nameDe:"Turkmenistan",                           nameAr:"تركمانستان" },
                       { code:"tv", nameEn:"Tuvalu",                       nameDe:"Tuvalu",                                 nameAr:"توفالو" },
                       { code:"ug", nameEn:"Uganda",                       nameDe:"Uganda",                                 nameAr:"أوغندا" },
                       { code:"ua", nameEn:"Ukraine",                      nameDe:"Ukraine",                                nameAr:"أوكرانيا" },
                       { code:"ae", nameEn:"United Arab Emirates",         nameDe:"Vereinigte Arabische Emirate",           nameAr:"الإمارات العربية المتحدة" },
                       { code:"gb", nameEn:"United Kingdom",               nameDe:"Vereinigtes Königreich",                 nameAr:"المملكة المتحدة" },
                       { code:"us", nameEn:"United States",                nameDe:"Vereinigte Staaten",                     nameAr:"الولايات المتحدة" },
                       { code:"uy", nameEn:"Uruguay",                      nameDe:"Uruguay",                                nameAr:"أوروغواي" },
                       { code:"uz", nameEn:"Uzbekistan",                   nameDe:"Usbekistan",                             nameAr:"أوزبكستان" },
                       { code:"vu", nameEn:"Vanuatu",                      nameDe:"Vanuatu",                                nameAr:"فانواتو" },
                       { code:"va", nameEn:"Vatican City",                 nameDe:"Vatikanstadt",                            nameAr:"الفاتيكان" },
                       { code:"ve", nameEn:"Venezuela",                    nameDe:"Venezuela",                               nameAr:"فنزويلا" },
                       { code:"vn", nameEn:"Vietnam",                      nameDe:"Vietnam",                                 nameAr:"فيتنام" },
                       { code:"ye", nameEn:"Yemen",                        nameDe:"Jemen",                                   nameAr:"اليمن" },
                       { code:"zm", nameEn:"Zambia",                       nameDe:"Sambia",                                  nameAr:"زامبيا" },
                       { code:"zw", nameEn:"Zimbabwe",                     nameDe:"Simbabwe",                                nameAr:"زيمبابوي" }
                     ];

                     /* ===== CAPITALS DATA ===== */
                     const countries = [
                       { code:"af", nameEn:"Afghanistan", nameDe:"Afghanistan", nameAr:"أفغانستان", capitalEn:"Kabul", capitalDe:"Kabul", capitalAr:"كابول" },
                       { code:"al", nameEn:"Albania", nameDe:"Albanien", nameAr:"ألبانيا", capitalEn:"Tirana", capitalDe:"Tirana", capitalAr:"تيرانا" },
                       { code:"dz", nameEn:"Algeria", nameDe:"Algerien", nameAr:"الجزائر", capitalEn:"Algiers", capitalDe:"Algier", capitalAr:"الجزائر" },
                       { code:"ad", nameEn:"Andorra", nameDe:"Andorra", nameAr:"أندورا", capitalEn:"Andorra la Vella", capitalDe:"Andorra la Vella", capitalAr:"أندورا لا فيلا" },
                       { code:"ao", nameEn:"Angola", nameDe:"Angola", nameAr:"أنغولا", capitalEn:"Luanda", capitalDe:"Luanda", capitalAr:"لواندا" },
                       { code:"ag", nameEn:"Antigua and Barbuda", nameDe:"Antigua und Barbuda", nameAr:"أنتيغوا وباربودا", capitalEn:"Saint John's", capitalDe:"Saint John's", capitalAr:"سانت جونز" },
                       { code:"ar", nameEn:"Argentina", nameDe:"Argentinien", nameAr:"الأرجنتين", capitalEn:"Buenos Aires", capitalDe:"Buenos Aires", capitalAr:"بوينس آيرس" },
                       { code:"am", nameEn:"Armenia", nameDe:"Armenien", nameAr:"أرمينيا", capitalEn:"Yerevan", capitalDe:"Jerewan", capitalAr:"يريفان" },
                       { code:"au", nameEn:"Australia", nameDe:"Australien", nameAr:"أستراليا", capitalEn:"Canberra", capitalDe:"Canberra", capitalAr:"كانبيرا" },
                       { code:"at", nameEn:"Austria", nameDe:"Österreich", nameAr:"النمسا", capitalEn:"Vienna", capitalDe:"Wien", capitalAr:"فيينا" },
                       { code:"az", nameEn:"Azerbaijan", nameDe:"Aserbaidschan", nameAr:"أذربيجان", capitalEn:"Baku", capitalDe:"Baku", capitalAr:"باكو" },
                       { code:"bs", nameEn:"Bahamas", nameDe:"Bahamas", nameAr:"باهاماس", capitalEn:"Nassau", capitalDe:"Nassau", capitalAr:"ناساو" },
                       { code:"bh", nameEn:"Bahrain", nameDe:"Bahrain", nameAr:"البحرين", capitalEn:"Manama", capitalDe:"Manama", capitalAr:"المنامة" },
                       { code:"bd", nameEn:"Bangladesh", nameDe:"Bangladesch", nameAr:"بنغلاديش", capitalEn:"Dhaka", capitalDe:"Dhaka", capitalAr:"داكا" },
                       { code:"bb", nameEn:"Barbados", nameDe:"Barbados", nameAr:"باربادوس", capitalEn:"Bridgetown", capitalDe:"Bridgetown", capitalAr:"بريدجتاون" },
                       { code:"by", nameEn:"Belarus", nameDe:"Weißrussland", nameAr:"بيلاروس", capitalEn:"Minsk", capitalDe:"Minsk", capitalAr:"مينسك" },
                       { code:"be", nameEn:"Belgium", nameDe:"Belgien", nameAr:"بلجيكا", capitalEn:"Brussels", capitalDe:"Brüssel", capitalAr:"بروكسل" },
                       { code:"bz", nameEn:"Belize", nameDe:"Belize", nameAr:"بليز", capitalEn:"Belmopan", capitalDe:"Belmopan", capitalAr:"بيلموبان" },
                       { code:"bj", nameEn:"Benin", nameDe:"Benin", nameAr:"بنين", capitalEn:"Porto-Novo", capitalDe:"Porto-Novo", capitalAr:"بورتو نوفو" },
                       { code:"bt", nameEn:"Bhutan", nameDe:"Bhutan", nameAr:"بوتان", capitalEn:"Thimphu", capitalDe:"Thimphu", capitalAr:"تيمفو" },
                       { code:"bo", nameEn:"Bolivia", nameDe:"Bolivien", nameAr:"بوليفيا", capitalEn:"Sucre", capitalDe:"Sucre", capitalAr:"سوكر" },
                       { code:"ba", nameEn:"Bosnia and Herzegovina", nameDe:"Bosnien und Herzegowina", nameAr:"البوسنة والهرسك", capitalEn:"Sarajevo", capitalDe:"Sarajevo", capitalAr:"سراييفو" },
                       { code:"bw", nameEn:"Botswana", nameDe:"Botswana", nameAr:"بوتسوانا", capitalEn:"Gaborone", capitalDe:"Gaborone", capitalAr:"جابورون" },
                       { code:"br", nameEn:"Brazil", nameDe:"Brasilien", nameAr:"البرازيل", capitalEn:"Brasília", capitalDe:"Brasília", capitalAr:"برازيليا" },
                       { code:"bn", nameEn:"Brunei", nameDe:"Brunei", nameAr:"بروناي", capitalEn:"Bandar Seri Begawan", capitalDe:"Bandar Seri Begawan", capitalAr:"بندر سيري بيغاوان" },
                       { code:"bg", nameEn:"Bulgaria", nameDe:"Bulgarien", nameAr:"بلغاريا", capitalEn:"Sofia", capitalDe:"Sofia", capitalAr:"صوفيا" },
                       { code:"bf", nameEn:"Burkina Faso", nameDe:"Burkina Faso", nameAr:"بوركينا فاسو", capitalEn:"Ouagadougou", capitalDe:"Ouagadougou", capitalAr:"واگادوغو" },
                       { code:"bi", nameEn:"Burundi", nameDe:"Burundi", nameAr:"بوروندي", capitalEn:"Gitega", capitalDe:"Gitega", capitalAr:"غيتيغا" },
                       { code:"cv", nameEn:"Cabo Verde", nameDe:"Kap Verde", nameAr:"الرأس الأخضر", capitalEn:"Praia", capitalDe:"Praia", capitalAr:"برايا" },
                       { code:"kh", nameEn:"Cambodia", nameDe:"Kambodscha", nameAr:"كمبوديا", capitalEn:"Phnom Penh", capitalDe:"Phnom Penh", capitalAr:"بنوم بنه" },
                       { code:"cm", nameEn:"Cameroon", nameDe:"Kamerun", nameAr:"الكاميرون", capitalEn:"Yaoundé", capitalDe:"Yaoundé", capitalAr:"ياوندي" },
                       { code:"ca", nameEn:"Canada", nameDe:"Kanada", nameAr:"كندا", capitalEn:"Ottawa", capitalDe:"Ottawa", capitalAr:"أوتاوا" },
                       { code:"cf", nameEn:"Central African Republic", nameDe:"Zentralafrikanische Republik", nameAr:"جمهورية أفريقيا الوسطى", capitalEn:"Bangui", capitalDe:"Bangui", capitalAr:"بانغي" },
                       { code:"td", nameEn:"Chad", nameDe:"Tschad", nameAr:"تشاد", capitalEn:"N'Djamena", capitalDe:"N'Djamena", capitalAr:"نجامينا" },
                       { code:"cl", nameEn:"Chile", nameDe:"Chile", nameAr:"تشيلي", capitalEn:"Santiago", capitalDe:"Santiago", capitalAr:"سانتياغو" },
                       { code:"cn", nameEn:"China", nameDe:"China", nameAr:"الصين", capitalEn:"Beijing", capitalDe:"Peking", capitalAr:"بكين" },
                       { code:"co", nameEn:"Colombia", nameDe:"Kolumbien", nameAr:"كولومبيا", capitalEn:"Bogotá", capitalDe:"Bogotá", capitalAr:"بوغوتا" },
                       { code:"km", nameEn:"Comoros", nameDe:"Komoren", nameAr:"جزر القمر", capitalEn:"Moroni", capitalDe:"Moroni", capitalAr:"موروني" },
                       { code:"cd", nameEn:"Congo (DRC)", nameDe:"Kongo (DRC)", nameAr:"الكونغو الديمقراطية", capitalEn:"Kinshasa", capitalDe:"Kinshasa", capitalAr:"كينشاسا" },
                       { code:"cg", nameEn:"Congo (Republic)", nameDe:"Kongo (Republik)", nameAr:"جمهورية الكونغو", capitalEn:"Brazzaville", capitalDe:"Brazzaville", capitalAr:"برازاڤيل" },
                       { code:"cr", nameEn:"Costa Rica", nameDe:"Costa Rica", nameAr:"كوستاريكا", capitalEn:"San José", capitalDe:"San José", capitalAr:"سان خوسيه" },
                       { code:"ci", nameEn:"Côte d'Ivoire", nameDe:"Elfenbeinküste", nameAr:"ساحل العاج", capitalEn:"Yamoussoukro", capitalDe:"Yamoussoukro", capitalAr:"ياموسوكرو" },
                       { code:"hr", nameEn:"Croatia", nameDe:"Kroatien", nameAr:"كرواتيا", capitalEn:"Zagreb", capitalDe:"Zagreb", capitalAr:"زغرب" },
                       { code:"cu", nameEn:"Cuba", nameDe:"Kuba", nameAr:"كوبا", capitalEn:"Havana", capitalDe:"Havanna", capitalAr:"هافانا" },
                       { code:"cy", nameEn:"Cyprus", nameDe:"Zypern", nameAr:"قبرص", capitalEn:"Nicosia", capitalDe:"Nikosia", capitalAr:"نيقوسيا" },
                       { code:"cz", nameEn:"Czech Republic", nameDe:"Tschechien", nameAr:"جمهورية التشيك", capitalEn:"Prague", capitalDe:"Prag", capitalAr:"براغ" },
                       { code:"dk", nameEn:"Denmark", nameDe:"Dänemark", nameAr:"الدنمارك", capitalEn:"Copenhagen", capitalDe:"Kopenhagen", capitalAr:"كوبنهاغن" },
                                        { code:"dj", nameEn:"Djibouti", nameDe:"Dschibuti", nameAr:"جيبوتي", capitalEn:"Djibouti", capitalDe:"Dschibuti", capitalAr:"جيبوتي" },
                                        { code:"dm", nameEn:"Dominica", nameDe:"Dominica", nameAr:"دومينيكا", capitalEn:"Roseau", capitalDe:"Roseau", capitalAr:"روزو" },
                                        { code:"do", nameEn:"Dominican Republic", nameDe:"Dominikanische Republik", nameAr:"جمهورية الدومينيكان", capitalEn:"Santo Domingo", capitalDe:"Santo Domingo", capitalAr:"سانتو دومينغو" },
                                        { code:"ec", nameEn:"Ecuador", nameDe:"Ecuador", nameAr:"الإكوادور", capitalEn:"Quito", capitalDe:"Quito", capitalAr:"كيتو" },
                                        { code:"eg", nameEn:"Egypt", nameDe:"Ägypten", nameAr:"مصر", capitalEn:"Cairo", capitalDe:"Kairo", capitalAr:"القاهرة" },
                                        { code:"sv", nameEn:"El Salvador", nameDe:"El Salvador", nameAr:"السلفادور", capitalEn:"San Salvador", capitalDe:"San Salvador", capitalAr:"سان سلفادور" },
                                        { code:"gq", nameEn:"Equatorial Guinea", nameDe:"Äquatorialguinea", nameAr:"غينيا الاستوائية", capitalEn:"Malabo", capitalDe:"Malabo", capitalAr:"مالابو" },
                                        { code:"er", nameEn:"Eritrea", nameDe:"Eritrea", nameAr:"إريتريا", capitalEn:"Asmara", capitalDe:"Asmara", capitalAr:"أسمرة" },
                                        { code:"ee", nameEn:"Estonia", nameDe:"Estland", nameAr:"إستونيا", capitalEn:"Tallinn", capitalDe:"Tallinn", capitalAr:"تالين" },
                                        { code:"sz", nameEn:"Eswatini", nameDe:"Eswatini", nameAr:"إسواتيني", capitalEn:"Mbabane", capitalDe:"Mbabane", capitalAr:"مبابان" },
                                        { code:"et", nameEn:"Ethiopia", nameDe:"Äthiopien", nameAr:"إثيوبيا", capitalEn:"Addis Ababa", capitalDe:"Addis Abeba", capitalAr:"أديس أبابا" },
                                        { code:"fj", nameEn:"Fiji", nameDe:"Fidschi", nameAr:"فيجي", capitalEn:"Suva", capitalDe:"Suva", capitalAr:"سوفا" },
                                        { code:"fi", nameEn:"Finland", nameDe:"Finnland", nameAr:"فنلندا", capitalEn:"Helsinki", capitalDe:"Helsinki", capitalAr:"هلسنكي" },
                                        { code:"fr", nameEn:"France", nameDe:"Frankreich", nameAr:"فرنسا", capitalEn:"Paris", capitalDe:"Paris", capitalAr:"باريس" },
                                        { code:"ga", nameEn:"Gabon", nameDe:"Gabun", nameAr:"الغابون", capitalEn:"Libreville", capitalDe:"Libreville", capitalAr:"ليبرفيل" },
                                        { code:"gm", nameEn:"Gambia", nameDe:"Gambia", nameAr:"غامبيا", capitalEn:"Banjul", capitalDe:"Banjul", capitalAr:"بانجول" },
                                        { code:"ge", nameEn:"Georgia", nameDe:"Georgien", nameAr:"جورجيا", capitalEn:"Tbilisi", capitalDe:"Tiflis", capitalAr:"تبليسي" },
                                        { code:"de", nameEn:"Germany", nameDe:"Deutschland", nameAr:"ألمانيا", capitalEn:"Berlin", capitalDe:"Berlin", capitalAr:"برلين" },
                                        { code:"gh", nameEn:"Ghana", nameDe:"Ghana", nameAr:"غانا", capitalEn:"Accra", capitalDe:"Accra", capitalAr:"أكرا" },
                                        { code:"gr", nameEn:"Greece", nameDe:"Griechenland", nameAr:"اليونان", capitalEn:"Athens", capitalDe:"Athen", capitalAr:"أثينا" },
                                        { code:"gd", nameEn:"Grenada", nameDe:"Grenada", nameAr:"جرينادا", capitalEn:"St. George's", capitalDe:"St. George's", capitalAr:"سانت جورج" },
                                        { code:"gt", nameEn:"Guatemala", nameDe:"Guatemala", nameAr:"غواتيمالا", capitalEn:"Guatemala City", capitalDe:"Guatemala-Stadt", capitalAr:"مدينة غواتيمالا" },
                                        { code:"gn", nameEn:"Guinea", nameDe:"Guinea", nameAr:"غينيا", capitalEn:"Conakry", capitalDe:"Conakry", capitalAr:"كوناكري" },
                                        { code:"gw", nameEn:"Guinea-Bissau", nameDe:"Guinea-Bissau", nameAr:"غينيا بيساو", capitalEn:"Bissau", capitalDe:"Bissau", capitalAr:"بيساو" },
                                        { code:"gy", nameEn:"Guyana", nameDe:"Guyana", nameAr:"غيانا", capitalEn:"Georgetown", capitalDe:"Georgetown", capitalAr:"جورجتاون" },
                                        { code:"ht", nameEn:"Haiti", nameDe:"Haiti", nameAr:"هايتي", capitalEn:"Port-au-Prince", capitalDe:"Port-au-Prince", capitalAr:"بورت أو برانس" },
                                        { code:"hn", nameEn:"Honduras", nameDe:"Honduras", nameAr:"هندوراس", capitalEn:"Tegucigalpa", capitalDe:"Tegucigalpa", capitalAr:"تيغوسيغالبا" },
                                        { code:"hu", nameEn:"Hungary", nameDe:"Ungarn", nameAr:"المجر", capitalEn:"Budapest", capitalDe:"Budapest", capitalAr:"بودابست" },
                                        { code:"is", nameEn:"Iceland", nameDe:"Island", nameAr:"أيسلندا", capitalEn:"Reykjavík", capitalDe:"Reykjavík", capitalAr:"ريكيافيك" },
                                        { code:"in", nameEn:"India", nameDe:"Indien", nameAr:"الهند", capitalEn:"New Delhi", capitalDe:"Neu-Delhi", capitalAr:"نيودلهي" },
                                        { code:"id", nameEn:"Indonesia", nameDe:"Indonesien", nameAr:"إندونيسيا", capitalEn:"Jakarta", capitalDe:"Jakarta", capitalAr:"جاكرتا" },
                                        { code:"ir", nameEn:"Iran", nameDe:"Iran", nameAr:"إيران", capitalEn:"Tehran", capitalDe:"Teheran", capitalAr:"طهران" },
                                        { code:"iq", nameEn:"Iraq", nameDe:"Irak", nameAr:"العراق", capitalEn:"Baghdad", capitalDe:"Bagdad", capitalAr:"بغداد" },
                                        { code:"ie", nameEn:"Ireland", nameDe:"Irland", nameAr:"أيرلندا", capitalEn:"Dublin", capitalDe:"Dublin", capitalAr:"دبلن" },
                                        { code:"ps", nameEn:"Palestine", nameDe:"Palästina", nameAr:"فلسطين", capitalEn:"Jerusalem", capitalDe:"Jerusalem", capitalAr:"القدس" },

                                        { code:"it", nameEn:"Italy", nameDe:"Italien", nameAr:"إيطاليا", capitalEn:"Rome", capitalDe:"Rom", capitalAr:"روما" },
                                        { code:"jm", nameEn:"Jamaica", nameDe:"Jamaika", nameAr:"جامايكا", capitalEn:"Kingston", capitalDe:"Kingston", capitalAr:"كينغستون" },
                                        { code:"jp", nameEn:"Japan", nameDe:"Japan", nameAr:"اليابان", capitalEn:"Tokyo", capitalDe:"Tokio", capitalAr:"طوكيو" },
                                        { code:"jo", nameEn:"Jordan", nameDe:"Jordanien", nameAr:"الأردن", capitalEn:"Amman", capitalDe:"Amman", capitalAr:"عمان" },
                                        { code:"kz", nameEn:"Kazakhstan", nameDe:"Kasachstan", nameAr:"كازاخستان", capitalEn:"Nur-Sultan", capitalDe:"Nursultan", capitalAr:"نور سلطان" },
                                        { code:"ke", nameEn:"Kenya", nameDe:"Kenia", nameAr:"كينيا", capitalEn:"Nairobi", capitalDe:"Nairobi", capitalAr:"نيروبي" },
                                        { code:"ki", nameEn:"Kiribati", nameDe:"Kiribati", nameAr:"كيريباتي", capitalEn:"Tarawa", capitalDe:"Tarawa", capitalAr:"تاراوا" },
                                        { code:"kw", nameEn:"Kuwait", nameDe:"Kuwait", nameAr:"الكويت", capitalEn:"Kuwait City", capitalDe:"Kuwait-Stadt", capitalAr:"مدينة الكويت" },
                                        { code:"kg", nameEn:"Kyrgyzstan", nameDe:"Kirgisistan", nameAr:"قرغيزستان", capitalEn:"Bishkek", capitalDe:"Bischkek", capitalAr:"بيشكك" },
                                        { code:"la", nameEn:"Laos", nameDe:"Laos", nameAr:"لاوس", capitalEn:"Vientiane", capitalDe:"Vientiane", capitalAr:"فينتيان" },
                                        { code:"lv", nameEn:"Latvia", nameDe:"Lettland", nameAr:"لاتفيا", capitalEn:"Riga", capitalDe:"Riga", capitalAr:"ريغا" },
                                        { code:"lb", nameEn:"Lebanon", nameDe:"Libanon", nameAr:"لبنان", capitalEn:"Beirut", capitalDe:"Beirut", capitalAr:"بيروت" },
                                        { code:"ls", nameEn:"Lesotho", nameDe:"Lesotho", nameAr:"ليسوتو", capitalEn:"Maseru", capitalDe:"Maseru", capitalAr:"ماسيرو" },
                                        { code:"lr", nameEn:"Liberia", nameDe:"Liberia", nameAr:"ليبيريا", capitalEn:"Monrovia", capitalDe:"Monrovia", capitalAr:"مونروفيا" },
                                        { code:"ly", nameEn:"Libya", nameDe:"Libyen", nameAr:"ليبيا", capitalEn:"Tripoli", capitalDe:"Tripolis", capitalAr:"طرابلس" },
                                        { code:"li", nameEn:"Liechtenstein", nameDe:"Liechtenstein", nameAr:"ليختنشتاين", capitalEn:"Vaduz", capitalDe:"Vaduz", capitalAr:"فادوتس" },
                                        { code:"lt", nameEn:"Lithuania", nameDe:"Litauen", nameAr:"ليتوانيا", capitalEn:"Vilnius", capitalDe:"Vilnius", capitalAr:"فيلنيوس" },
                                        { code:"lu", nameEn:"Luxembourg", nameDe:"Luxemburg", nameAr:"لوكسمبورغ", capitalEn:"Luxembourg City", capitalDe:"Luxemburg", capitalAr:"لوكسمبورغ" },
                                        { code:"mg", nameEn:"Madagascar", nameDe:"Madagaskar", nameAr:"مدغشقر", capitalEn:"Antananarivo", capitalDe:"Antananarivo", capitalAr:"أنتاناناريفو" },
                                        { code:"mw", nameEn:"Malawi", nameDe:"Malawi", nameAr:"مالاوي", capitalEn:"Lilongwe", capitalDe:"Lilongwe", capitalAr:"ليلونغوي" },
                                        { code:"my", nameEn:"Malaysia", nameDe:"Malaysia", nameAr:"ماليزيا", capitalEn:"Kuala Lumpur", capitalDe:"Kuala Lumpur", capitalAr:"كوالالمبور" },
                                        { code:"mv", nameEn:"Maldives", nameDe:"Malediven", nameAr:"المالديف", capitalEn:"Malé", capitalDe:"Malé", capitalAr:"ماليه" },
                                        { code:"ml", nameEn:"Mali", nameDe:"Mali", nameAr:"مالي", capitalEn:"Bamako", capitalDe:"Bamako", capitalAr:"باماكو" },
                                        { code:"mt", nameEn:"Malta", nameDe:"Malta", nameAr:"مالطا", capitalEn:"Valletta", capitalDe:"Valletta", capitalAr:"فاليتا" },
                                        { code:"mh", nameEn:"Marshall Islands", nameDe:"Marshallinseln", nameAr:"جزر مارشال", capitalEn:"Majuro", capitalDe:"Majuro", capitalAr:"ماجورو" },
                                        { code:"mq", nameEn:"Martinique", nameDe:"Martinique", nameAr:"مارتينيك", capitalEn:"Fort-de-France", capitalDe:"Fort-de-France", capitalAr:"فورت دي فرانس" },
                                        { code:"mr", nameEn:"Mauritania", nameDe:"Mauretanien", nameAr:"موريتانيا", capitalEn:"Nouakchott", capitalDe:"Nouakchott", capitalAr:"نوكشوط" },
                                        { code:"mu", nameEn:"Mauritius", nameDe:"Mauritius", nameAr:"موريشيوس", capitalEn:"Port Louis", capitalDe:"Port Louis", capitalAr:"بورت لويس" },
                                        { code:"yt", nameEn:"Mayotte", nameDe:"Mayotte", nameAr:"مايوت", capitalEn:"Mamoudzou", capitalDe:"Mamoudzou", capitalAr:"مامودزو" },
                                        { code:"mx", nameEn:"Mexico", nameDe:"Mexiko", nameAr:"المكسيك", capitalEn:"Mexico City", capitalDe:"Mexiko-Stadt", capitalAr:"مدينة مكسيكو" },
                                        { code:"fm", nameEn:"Micronesia", nameDe:"Mikronesien", nameAr:"ميكرونيزيا", capitalEn:"Palikir", capitalDe:"Palikir", capitalAr:"بالكير" },
                                        { code:"md", nameEn:"Moldova", nameDe:"Moldau", nameAr:"مولدوفا", capitalEn:"Chișinău", capitalDe:"Chișinău", capitalAr:"كيسيناو" },
                                        { code:"mc", nameEn:"Monaco", nameDe:"Monaco", nameAr:"موناكو", capitalEn:"Monaco", capitalDe:"Monaco", capitalAr:"موناكو" },
                                        { code:"mn", nameEn:"Mongolia", nameDe:"Mongolei", nameAr:"منغوليا", capitalEn:"Ulaanbaatar", capitalDe:"Ulaanbaatar", capitalAr:"أولان باتور" },
                                        { code:"me", nameEn:"Montenegro", nameDe:"Montenegro", nameAr:"الجبل الأسود", capitalEn:"Podgorica", capitalDe:"Podgorica", capitalAr:"بودغوريتسا" },
                                        { code:"ms", nameEn:"Montserrat", nameDe:"Montserrat", nameAr:"مونتسيرات", capitalEn:"Plymouth", capitalDe:"Plymouth", capitalAr:"بليموث" },
                                        { code:"ma", nameEn:"Morocco", nameDe:"Marokko", nameAr:"المغرب", capitalEn:"Rabat", capitalDe:"Rabat", capitalAr:"الرباط" },
                                        { code:"mz", nameEn:"Mozambique", nameDe:"Mosambik", nameAr:"موزمبيق", capitalEn:"Maputo", capitalDe:"Maputo", capitalAr:"مابوتو" },
                                        { code:"mm", nameEn:"Myanmar", nameDe:"Myanmar", nameAr:"ميانمار", capitalEn:"Naypyidaw", capitalDe:"Naypyidaw", capitalAr:"نيبيداو" },
                                        { code:"na", nameEn:"Namibia", nameDe:"Namibia", nameAr:"ناميبيا", capitalEn:"Windhoek", capitalDe:"Windhoek", capitalAr:"ويندهوك" },
                                        { code:"nr", nameEn:"Nauru", nameDe:"Nauru", nameAr:"ناورو", capitalEn:"Yaren", capitalDe:"Yaren", capitalAr:"يارين" },
                                        { code:"np", nameEn:"Nepal", nameDe:"Nepal", nameAr:"نيبال", capitalEn:"Kathmandu", capitalDe:"Kathmandu", capitalAr:"كاتماندو" },
                                        { code:"nl", nameEn:"Netherlands", nameDe:"Niederlande", nameAr:"هولندا", capitalEn:"Amsterdam", capitalDe:"Amsterdam", capitalAr:"أمستردام" },
                                        { code:"nc", nameEn:"New Caledonia", nameDe:"Neukaledonien", nameAr:"كاليدونيا الجديدة", capitalEn:"Nouméa", capitalDe:"Nouméa", capitalAr:"نومي" },
                                        { code:"nz", nameEn:"New Zealand", nameDe:"Neuseeland", nameAr:"نيوزيلندا", capitalEn:"Wellington", capitalDe:"Wellington", capitalAr:"ويلينغتون" },
                                        { code:"ni", nameEn:"Nicaragua", nameDe:"Nicaragua", nameAr:"نيكاراغوا", capitalEn:"Managua", capitalDe:"Managua", capitalAr:"ماناغوا" },
                                        { code:"ne", nameEn:"Niger", nameDe:"Niger", nameAr:"النيجر", capitalEn:"Niamey", capitalDe:"Niamey", capitalAr:"نيامي" },
                                        { code:"ng", nameEn:"Nigeria", nameDe:"Nigeria", nameAr:"نيجيريا", capitalEn:"Abuja", capitalDe:"Abuja", capitalAr:"أبوجا" },
                                        { code:"nu", nameEn:"Niue", nameDe:"Niue", nameAr:"نيوي", capitalEn:"Alofi", capitalDe:"Alofi", capitalAr:"ألوفي" },
                                        { code:"nf", nameEn:"Norfolk Island", nameDe:"Norfolkinsel", nameAr:"جزيرة نورفولك", capitalEn:"Kingston", capitalDe:"Kingston", capitalAr:"كينغستون" },
                                        { code:"kp", nameEn:"North Korea", nameDe:"Nordkorea", nameAr:"كوريا الشمالية", capitalEn:"Pyongyang", capitalDe:"Pjöngjang", capitalAr:"بيونغ يانغ" },
                                        { code:"mk", nameEn:"North Macedonia", nameDe:"Nordmazedonien", nameAr:"مقدونيا الشمالية", capitalEn:"Skopje", capitalDe:"Skopje", capitalAr:"سكوبي" },
                                        { code:"mp", nameEn:"Northern Mariana Islands", nameDe:"Nördliche Marianen", nameAr:"جزر ماريانا الشمالية", capitalEn:"Saipan", capitalDe:"Saipan", capitalAr:"سايبان" },
                                        { code:"no", nameEn:"Norway", nameDe:"Norwegen", nameAr:"النرويج", capitalEn:"Oslo", capitalDe:"Oslo", capitalAr:"أوسلو" },
                                        { code:"om", nameEn:"Oman", nameDe:"Oman", nameAr:"عمان", capitalEn:"Muscat", capitalDe:"Maskat", capitalAr:"مسقط" },
                                        { code:"pk", nameEn:"Pakistan", nameDe:"Pakistan", nameAr:"باكستان", capitalEn:"Islamabad", capitalDe:"Islamabad", capitalAr:"إسلام آباد" },
                                        { code:"pw", nameEn:"Palau", nameDe:"Palau", nameAr:"بالاو", capitalEn:"Ngerulmud", capitalDe:"Ngerulmud", capitalAr:"نغيرولمود" },

                                        { code:"pa", nameEn:"Panama", nameDe:"Panama", nameAr:"بنما", capitalEn:"Panama City", capitalDe:"Panama-Stadt", capitalAr:"مدينة بنما" },
                                        { code:"pg", nameEn:"Papua New Guinea", nameDe:"Papua-Neuguinea", nameAr:"بابوا غينيا الجديدة", capitalEn:"Port Moresby", capitalDe:"Port Moresby", capitalAr:"بورت موريسبي" },
                                        { code:"py", nameEn:"Paraguay", nameDe:"Paraguay", nameAr:"باراغواي", capitalEn:"Asunción", capitalDe:"Asunción", capitalAr:"أسونسيون" },
                                        { code:"pe", nameEn:"Peru", nameDe:"Peru", nameAr:"بيرو", capitalEn:"Lima", capitalDe:"Lima", capitalAr:"ليما" },
                                        { code:"ph", nameEn:"Philippines", nameDe:"Philippinen", nameAr:"الفلبين", capitalEn:"Manila", capitalDe:"Manila", capitalAr:"مانيلا" },
                                        { code:"pl", nameEn:"Poland", nameDe:"Polen", nameAr:"بولندا", capitalEn:"Warsaw", capitalDe:"Warschau", capitalAr:"وارسو" },
                                        { code:"pt", nameEn:"Portugal", nameDe:"Portugal", nameAr:"البرتغال", capitalEn:"Lisbon", capitalDe:"Lissabon", capitalAr:"لشبونة" },
                                        { code:"pr", nameEn:"Puerto Rico", nameDe:"Puerto Rico", nameAr:"بورتو ريكو", capitalEn:"San Juan", capitalDe:"San Juan", capitalAr:"سان خوان" },
                                        { code:"qa", nameEn:"Qatar", nameDe:"Katar", nameAr:"قطر", capitalEn:"Doha", capitalDe:"Doha", capitalAr:"الدوحة" },
                                        { code:"re", nameEn:"Réunion", nameDe:"Réunion", nameAr:"ريونيون", capitalEn:"Saint-Denis", capitalDe:"Saint-Denis", capitalAr:"سانت دينيس" },
                                        { code:"ro", nameEn:"Romania", nameDe:"Rumänien", nameAr:"رومانيا", capitalEn:"Bucharest", capitalDe:"Bukarest", capitalAr:"بوخارست" },
                                        { code:"ru", nameEn:"Russia", nameDe:"Russland", nameAr:"روسيا", capitalEn:"Moscow", capitalDe:"Moskau", capitalAr:"موسكو" },
                                        { code:"rw", nameEn:"Rwanda", nameDe:"Ruanda", nameAr:"رواندا", capitalEn:"Kigali", capitalDe:"Kigali", capitalAr:"كيغالي" },
                                        { code:"bl", nameEn:"Saint Barthélemy", nameDe:"Saint-Barthélemy", nameAr:"سان بارتيلمي", capitalEn:"Gustavia", capitalDe:"Gustavia", capitalAr:"غوستافيا" },
                                        { code:"sh", nameEn:"Saint Helena", nameDe:"St. Helena", nameAr:"سانت هيلينا", capitalEn:"Jamestown", capitalDe:"Jamestown", capitalAr:"جامستاون" },
                                        { code:"kn", nameEn:"Saint Kitts and Nevis", nameDe:"St. Kitts und Nevis", nameAr:"سانت كيتس ونيفيس", capitalEn:"Basseterre", capitalDe:"Basseterre", capitalAr:"باسيتير" },
                                        { code:"lc", nameEn:"Saint Lucia", nameDe:"St. Lucia", nameAr:"سانت لوسيا", capitalEn:"Castries", capitalDe:"Castries", capitalAr:"كاستري" },
                                        { code:"mf", nameEn:"Saint Martin", nameDe:"Saint-Martin", nameAr:"سانت مارتن", capitalEn:"Marigot", capitalDe:"Marigot", capitalAr:"ماريغو" },
                                        { code:"pm", nameEn:"Saint Pierre and Miquelon", nameDe:"Saint-Pierre und Miquelon", nameAr:"سانت بيير وميكلون", capitalEn:"Saint-Pierre", capitalDe:"Saint-Pierre", capitalAr:"سانت بيير" },
                                        { code:"vc", nameEn:"Saint Vincent and the Grenadines", nameDe:"St. Vincent und die Grenadinen", nameAr:"سانت فنسنت وجزر غرينادين", capitalEn:"Kingstown", capitalDe:"Kingstown", capitalAr:"كينغستاون" },
                                        { code:"ws", nameEn:"Samoa", nameDe:"Samoa", nameAr:"ساموا", capitalEn:"Apia", capitalDe:"Apia", capitalAr:"أبيا" },
                                        { code:"sm", nameEn:"San Marino", nameDe:"San Marino", nameAr:"سان مارينو", capitalEn:"San Marino", capitalDe:"San Marino", capitalAr:"سان مارينو" },
                                        { code:"st", nameEn:"Sao Tome and Principe", nameDe:"São Tomé und Príncipe", nameAr:"ساو تومي وبرينسيبي", capitalEn:"São Tomé", capitalDe:"São Tomé", capitalAr:"ساو تومي" },
                                        { code:"sa", nameEn:"Saudi Arabia", nameDe:"Saudi-Arabien", nameAr:"المملكة العربية السعودية", capitalEn:"Riyadh", capitalDe:"Riad", capitalAr:"الرياض" },
                                        { code:"sn", nameEn:"Senegal", nameDe:"Senegal", nameAr:"السنغال", capitalEn:"Dakar", capitalDe:"Dakar", capitalAr:"داكار" },
                                        { code:"rs", nameEn:"Serbia", nameDe:"Serbien", nameAr:"صربيا", capitalEn:"Belgrade", capitalDe:"Belgrad", capitalAr:"بلغراد" },
                                        { code:"sc", nameEn:"Seychelles", nameDe:"Seychellen", nameAr:"سيشيل", capitalEn:"Victoria", capitalDe:"Victoria", capitalAr:"فيكتوريا" },
                                        { code:"sl", nameEn:"Sierra Leone", nameDe:"Sierra Leone", nameAr:"سيراليون", capitalEn:"Freetown", capitalDe:"Freetown", capitalAr:"فري تاون" },
                                        { code:"sg", nameEn:"Singapore", nameDe:"Singapur", nameAr:"سنغافورة", capitalEn:"Singapore", capitalDe:"Singapur", capitalAr:"سنغافورة" },
                                        { code:"sx", nameEn:"Sint Maarten", nameDe:"Sint Maarten", nameAr:"سينت مارتن", capitalEn:"Philipsburg", capitalDe:"Philipsburg", capitalAr:"فيلبسبرغ" },
                                        { code:"sk", nameEn:"Slovakia", nameDe:"Slowakei", nameAr:"سلوفاكيا", capitalEn:"Bratislava", capitalDe:"Bratislava", capitalAr:"براتيسلافا" },
                                        { code:"si", nameEn:"Slovenia", nameDe:"Slowenien", nameAr:"سلوفينيا", capitalEn:"Ljubljana", capitalDe:"Ljubljana", capitalAr:"ليوبليانا" },
                                        { code:"sb", nameEn:"Solomon Islands", nameDe:"Salomonen", nameAr:"جزر سليمان", capitalEn:"Honiara", capitalDe:"Honiara", capitalAr:"هونيارا" },
                                        { code:"so", nameEn:"Somalia", nameDe:"Somalia", nameAr:"الصومال", capitalEn:"Mogadishu", capitalDe:"Mogadischu", capitalAr:"مقديشو" },
                                        { code:"za", nameEn:"South Africa", nameDe:"Südafrika", nameAr:"جنوب أفريقيا", capitalEn:"Pretoria", capitalDe:"Pretoria", capitalAr:"بريتوريا" },
                                        { code:"kr", nameEn:"South Korea", nameDe:"Südkorea", nameAr:"كوريا الجنوبية", capitalEn:"Seoul", capitalDe:"Seoul", capitalAr:"سيول" },
                                        { code:"ss", nameEn:"South Sudan", nameDe:"Südsudan", nameAr:"جنوب السودان", capitalEn:"Juba", capitalDe:"Juba", capitalAr:"جوبا" },
                                        { code:"es", nameEn:"Spain", nameDe:"Spanien", nameAr:"إسبانيا", capitalEn:"Madrid", capitalDe:"Madrid", capitalAr:"مدريد" },
                                        { code:"lk", nameEn:"Sri Lanka", nameDe:"Sri Lanka", nameAr:"سريلانكا", capitalEn:"Sri Jayawardenepura Kotte", capitalDe:"Sri Jayawardenepura Kotte", capitalAr:"سري جايوردنابورا كوتي" },
                                        { code:"sd", nameEn:"Sudan", nameDe:"Sudan", nameAr:"السودان", capitalEn:"Khartoum", capitalDe:"Khartum", capitalAr:"الخرطوم" },
                                        { code:"sr", nameEn:"Suriname", nameDe:"Suriname", nameAr:"سورينام", capitalEn:"Paramaribo", capitalDe:"Paramaribo", capitalAr:"باراماريبو" },
                                        { code:"se", nameEn:"Sweden", nameDe:"Schweden", nameAr:"السويد", capitalEn:"Stockholm", capitalDe:"Stockholm", capitalAr:"ستوكهولم" },
                                        { code:"ch", nameEn:"Switzerland", nameDe:"Schweiz", nameAr:"سويسرا", capitalEn:"Bern", capitalDe:"Bern", capitalAr:"برن" },
                                        { code:"sy", nameEn:"Syria", nameDe:"Syrien", nameAr:"سوريا", capitalEn:"Damascus", capitalDe:"Damaskus", capitalAr:"دمشق" },
                                        { code:"tw", nameEn:"Taiwan", nameDe:"Taiwan", nameAr:"تايوان", capitalEn:"Taipei", capitalDe:"Taipeh", capitalAr:"تايبيه" },
                                        { code:"tj", nameEn:"Tajikistan", nameDe:"Tadschikistan", nameAr:"طاجيكستان", capitalEn:"Dushanbe", capitalDe:"Duschanbe", capitalAr:"دوشانبي" },
                                        { code:"tz", nameEn:"Tanzania", nameDe:"Tansania", nameAr:"تنزانيا", capitalEn:"Dodoma", capitalDe:"Dodoma", capitalAr:"دودوما" },
                                        { code:"th", nameEn:"Thailand", nameDe:"Thailand", nameAr:"تايلاند", capitalEn:"Bangkok", capitalDe:"Bangkok", capitalAr:"بانكوك" },
                                        { code:"tl", nameEn:"Timor-Leste", nameDe:"Osttimor", nameAr:"تيمور الشرقية", capitalEn:"Dili", capitalDe:"Dili", capitalAr:"ديلي" },
                                        { code:"tg", nameEn:"Togo", nameDe:"Togo", nameAr:"توغو", capitalEn:"Lomé", capitalDe:"Lomé", capitalAr:"لومي" },
                                        { code:"tk", nameEn:"Tokelau", nameDe:"Tokelau", nameAr:"توكيلاو", capitalEn:"Fakaofo", capitalDe:"Fakaofo", capitalAr:"فاكاوفو" },
                                        { code:"to", nameEn:"Tonga", nameDe:"Tonga", nameAr:"تونغا", capitalEn:"Nukuʻalofa", capitalDe:"Nukuʻalofa", capitalAr:"نوكوالوفا" },
                                        { code:"tt", nameEn:"Trinidad and Tobago", nameDe:"Trinidad und Tobago", nameAr:"ترينيداد وتوباغو", capitalEn:"Port of Spain", capitalDe:"Port-of-Spain", capitalAr:"بورت أوف سبين" },
                                        { code:"tn", nameEn:"Tunisia", nameDe:"Tunesien", nameAr:"تونس", capitalEn:"Tunis", capitalDe:"Tunis", capitalAr:"تونس" },
                                        { code:"tr", nameEn:"Turkey", nameDe:"Türkei", nameAr:"تركيا", capitalEn:"Ankara", capitalDe:"Ankara", capitalAr:"أنقرة" },
                                        { code:"tm", nameEn:"Turkmenistan", nameDe:"Turkmenistan", nameAr:"تركمانستان", capitalEn:"Ashgabat", capitalDe:"Aschgabat", capitalAr:"عشق آباد" },
                                        { code:"tv", nameEn:"Tuvalu", nameDe:"Tuvalu", nameAr:"توفالو", capitalEn:"Funafuti", capitalDe:"Funafuti", capitalAr:"فونا فوتي" },
                                        { code:"ug", nameEn:"Uganda", nameDe:"Uganda", nameAr:"أوغندا", capitalEn:"Kampala", capitalDe:"Kampala", capitalAr:"كامبالا" },
                                        { code:"ua", nameEn:"Ukraine", nameDe:"Ukraine", nameAr:"أوكرانيا", capitalEn:"Kyiv", capitalDe:"Kiew", capitalAr:"كييف" },
                                        { code:"ae", nameEn:"United Arab Emirates", nameDe:"Vereinigte Arabische Emirate", nameAr:"الإمارات العربية المتحدة", capitalEn:"Abu Dhabi", capitalDe:"Abu Dhabi", capitalAr:"أبو ظبي" },
                                        { code:"gb", nameEn:"United Kingdom", nameDe:"Vereinigtes Königreich", nameAr:"المملكة المتحدة", capitalEn:"London", capitalDe:"London", capitalAr:"لندن" },
                                        { code:"us", nameEn:"United States", nameDe:"Vereinigte Staaten", nameAr:"الولايات المتحدة", capitalEn:"Washington, D.C.", capitalDe:"Washington, D.C.", capitalAr:"واشنطن" },
                                        { code:"uy", nameEn:"Uruguay", nameDe:"Uruguay", nameAr:"أوروغواي", capitalEn:"Montevideo", capitalDe:"Montevideo", capitalAr:"مونتيفيديو" },
                                        { code:"uz", nameEn:"Uzbekistan", nameDe:"Usbekistan", nameAr:"أوزبكستان", capitalEn:"Tashkent", capitalDe:"Taschkent", capitalAr:"طشقند" },
                                        { code:"vu", nameEn:"Vanuatu", nameDe:"Vanuatu", nameAr:"فانواتو", capitalEn:"Port Vila", capitalDe:"Port Vila", capitalAr:"بورت فيلا" },
                                        { code:"va", nameEn:"Vatican City", nameDe:"Vatikanstadt", nameAr:"مدينة الفاتيكان", capitalEn:"Vatican City", capitalDe:"Vatikanstadt", capitalAr:"مدينة الفاتيكان" },
                                        { code:"ve", nameEn:"Venezuela", nameDe:"Venezuela", nameAr:"فنزويلا", capitalEn:"Caracas", capitalDe:"Caracas", capitalAr:"كاراكاس" },
                                        { code:"vn", nameEn:"Vietnam", nameDe:"Vietnam", nameAr:"فيتنام", capitalEn:"Hanoi", capitalDe:"Hanoi", capitalAr:"هانوي" },
                                        { code:"wf", nameEn:"Wallis and Futuna", nameDe:"Wallis und Futuna", nameAr:"واليس وفوتونا", capitalEn:"Mata-Utu", capitalDe:"Mata-Utu", capitalAr:"ماتا أوتو" },
                                        { code:"eh", nameEn:"Western Sahara", nameDe:"Westsahara", nameAr:"الصحراء الغربية", capitalEn:"El Aaiún", capitalDe:"El Aaiún", capitalAr:"العيون" },
                                        { code:"ye", nameEn:"Yemen", nameDe:"Jemen", nameAr:"اليمن", capitalEn:"Sana'a", capitalDe:"Sanaa", capitalAr:"صنعاء" },
                                        { code:"zm", nameEn:"Zambia", nameDe:"Sambia", nameAr:"زامبيا", capitalEn:"Lusaka", capitalDe:"Lusaka", capitalAr:"لوساكا" },
                                        { code:"zw", nameEn:"Zimbabwe", nameDe:"Simbabwe", nameAr:"زيمبابوي", capitalEn:"Harare", capitalDe:"Harare", capitalAr:"هاراري" }

                     ];

        /* =========================
           FLAG GAME STATE
        ========================= */
        let remainingFlags = [];
        let correctFlag = null;
        let correctFlagCount = 0;
        let wrongFlagCount = 0;

        function updateFlagScores() {
          const correctId = currentLang === "de" ? "correctScore" : currentLang === "en" ? "correctScoreEn" : "correctScoreAr";
          const wrongId = currentLang === "de" ? "wrongScore" : currentLang === "en" ? "wrongScoreEn" : "wrongScoreAr";
          document.getElementById(correctId).textContent = correctFlagCount;
          document.getElementById(wrongId).textContent = wrongFlagCount;
        }

            function generateFlagButtons() {
              if (!correctFlag) return;
              updateDirection();
              const optionsDiv = document.getElementById("options");
              optionsDiv.innerHTML = "";

              const others = shuffle(flags.filter(f => f.code !== correctFlag.code)).slice(0,3);
              const choices = shuffle([correctFlag, ...others]);

              choices.forEach(choice => {
                const btn = document.createElement("button");
                btn.dataset.code = choice.code;

                // set text in current language
                btn.innerHTML = currentLang === "de" ? choice.nameDe : currentLang === "ar" ? choice.nameAr : choice.nameEn;

                // Remove pre-answer coloring
                btn.classList.remove("correct", "wrong");

                btn.onclick = () => {
                  [...optionsDiv.children].forEach(b => b.disabled = true);
                  const result = document.getElementById("result");

                  if (btn.dataset.code === correctFlag.code) {
                    btn.classList.add("correct");
                    result.style.color = "green";
                    result.textContent = messages.correct[currentLang];
                    correctFlagCount++;
                  } else {
                    btn.classList.add("wrong");
                    result.style.color = "red";
                    result.textContent = messages.wrong[currentLang];

                    // show correct answer
                    [...optionsDiv.children].forEach(b => {
                      if (b.dataset.code === correctFlag.code) b.classList.add("correct");
                    });

                    wrongFlagCount++;
                  }

                  updateFlagScores();

                  setTimeout(() => {
                    result.textContent = "";
                    nextFlag();
                  }, 1000);
                };

                optionsDiv.appendChild(btn);
              });
            }

            function generateCapitalButtons() {
              if (!correctCapital) return;
              updateDirection();
              const optionsDiv = document.getElementById("optionsCap");
              optionsDiv.innerHTML = "";

              const others = shuffle(countries.filter(c => c.code !== correctCapital.code)).slice(0,3);
              const choices = shuffle([correctCapital, ...others]);

              choices.forEach(choice => {
                const btn = document.createElement("button");
                btn.dataset.code = choice.code;
                btn.textContent = currentLang === "de" ? choice.capitalDe : currentLang === "ar" ? choice.capitalAr : choice.capitalEn;

                // Remove pre-answer coloring
                btn.classList.remove("correct", "wrong");

                btn.onclick = () => {
                  [...optionsDiv.children].forEach(b => b.disabled = true);
                  const result = document.getElementById("resultCap");

                  if (btn.dataset.code === correctCapital.code) {
                    btn.classList.add("correct");
                    result.style.color = "green";
                    result.textContent = messages.correct[currentLang];
                    correctCapitalCount++;
                  } else {
                    btn.classList.add("wrong");
                    result.style.color = "red";
                    result.textContent = messages.wrong[currentLang];

                    // show correct answer
                    [...optionsDiv.children].forEach(b => {
                      if (b.dataset.code === correctCapital.code) b.classList.add("correct");
                    });

                    wrongCapitalCount++;
                  }

                  updateCapitalScores();

                  setTimeout(() => {
                    result.textContent = "";
                    nextCapital();
                  }, 1000);
                };

                optionsDiv.appendChild(btn);
              });
            }

        function nextFlag() {
          if (remainingFlags.length === 0) {
            alert(currentLang === "de" ? "Spiel beendet!" : currentLang === "ar" ? "انتهت اللعبة!" : "Game finished!");
            return;
          }
          correctFlag = remainingFlags.pop();
          document.getElementById("flagImg").src = `https://flagcdn.com/w320/${correctFlag.code}.png`;
          generateFlagButtons();
        }

        function resetFlags() {
          remainingFlags = shuffle([...flags]);
          correctFlagCount = 0;
          wrongFlagCount = 0;
          updateFlagScores();
          nextFlag();
        }

        /* =========================
           CAPITALS GAME STATE
        ========================= */
        let remainingCapitals = [];
        let correctCapital = null;
        let correctCapitalCount = 0;
        let wrongCapitalCount = 0;

        function updateCapitalScores() {
          const correctId = currentLang === "de" ? "correctScoreCap" : currentLang === "en" ? "correctScoreEnCap" : "correctScoreArCap";
          const wrongId = currentLang === "de" ? "wrongScoreCap" : currentLang === "en" ? "wrongScoreEnCap" : "wrongScoreArCap";
          document.getElementById(correctId).textContent = correctCapitalCount;
          document.getElementById(wrongId).textContent = wrongCapitalCount;
        }

        function nextCapital() {
          if (remainingCapitals.length === 0) {
            alert(currentLang === "de" ? "Spiel beendet!" : currentLang === "ar" ? "انتهت اللعبة!" : "Game finished!");
            return;
          }

          correctCapital = remainingCapitals.pop();
          document.getElementById("flagImgCap").src = `https://flagcdn.com/w320/${correctCapital.code}.png`;

          const countryNameEl = document.getElementById("countryName");
          countryNameEl.textContent = currentLang === "de" ? correctCapital.nameDe : currentLang === "ar" ? correctCapital.nameAr : correctCapital.nameEn;
          countryNameEl.style.direction = currentLang === "ar" ? "rtl" : "ltr";

          generateCapitalButtons();
        }

        function resetCapitals() {
          remainingCapitals = shuffle([...countries]);
          correctCapitalCount = 0;
          wrongCapitalCount = 0;
          updateCapitalScores();
          nextCapital();
        }

        /* =========================
           LANGUAGE SWITCH
        ========================= */
        document.querySelectorAll('[id^="lang-"]').forEach(btn => {
          btn.addEventListener("click", () => {
            currentLang = btn.id.replace("lang-", "");
            localStorage.setItem("lang", currentLang);
            updateDirection();
            generateFlagButtons();
            generateCapitalButtons();

            // update country name
            if (correctCapital) {
              const countryNameEl = document.getElementById("countryName");
              countryNameEl.textContent = currentLang === "de" ? correctCapital.nameDe : currentLang === "ar" ? correctCapital.nameAr : correctCapital.nameEn;
              countryNameEl.style.direction = currentLang === "ar" ? "rtl" : "ltr";
            }

            updateFlagScores();
            updateCapitalScores();
          });
        });

        /* =========================
           SWITCHER LOGIC
        ========================= */
        const btnFlags = document.getElementById("btnFlags");
        const btnCapitals = document.getElementById("btnCapitals");
        const flagContent = document.getElementById("flagGameContent");
        const capitalContent = document.getElementById("capitalGameContent");

        btnFlags.addEventListener("click", () => {
          flagContent.style.display = "block";
          capitalContent.style.display = "none";
          btnFlags.classList.add("switch-active");
          btnCapitals.classList.remove("switch-active");
        });

        btnCapitals.addEventListener("click", () => {
          flagContent.style.display = "none";
          capitalContent.style.display = "block";
          btnCapitals.classList.add("switch-active");
          btnFlags.classList.remove("switch-active");
        });

        /* =========================
           INIT
        ========================= */
        resetFlags();
        resetCapitals();
        updateDirection();
        
