# สเปกการเชื่อม Launcher และสตูดิโอ

## ลำดับแก้รุ่นทดสอบ

| งาน | การเปลี่ยนแปลง | เกณฑ์ผ่าน |
|---|---|---|
| Google Sign-In บน Windows | อนุญาต Supabase เฉพาะโดเมนที่ตั้งค่า ตรวจ redirect ที่ลงทะเบียนและเส้นทางจากเว็บกลับแอป ใช้ตัวรับ loopback อายุสั้นและตรวจสถานะต่อคำขอ ให้เว็บแสดงผลตามการตอบรับจากแอป | เลือกบัญชีแล้วกลับเข้าคลัง แอปลงชื่อออกได้ ลองใหม่ได้หลังยกเลิกหรือหมดเวลา ไม่มีข้อมูลเซสชันใน URL ที่บันทึกหรือในล็อก |
| คลัง meDoc | สร้างแค็ตตาล็อกสาธารณะจากขั้นตอนปล่อยรุ่นผ่านเว็บของโครงการ เก็บฉบับตรวจสอบแล้วสำหรับแสดงสถานะออฟไลน์ และใช้ GitHub Releases เป็นที่เก็บแพ็กเกจ | ทดสอบเมื่อ GitHub จำกัดคำขอ เน็ตหลุด ไม่เคยเปิดแอปมาก่อน และมีแอปติดตั้งแล้ว เปิดแอปที่มีอยู่ได้ในเครื่อง |
| การติดตั้งและอัปเดต | ตรวจรหัสแอป รุ่น สถาปัตยกรรม ขนาด SHA-256 และแหล่งดาวน์โหลด แยกตัวโปรแกรมจากไฟล์ผู้ใช้ เปลี่ยนรุ่นหลังแพ็กเกจผ่านการตรวจ | ติดตั้ง อัปเดต และถอน meDoc จาก Windows เครื่องสะอาดได้ เมื่ออัปเดตเสีย แอปรุ่นเดิมและเอกสารยังเปิดได้ |

ผลตรวจจากคลิปแสดงว่าเว็บล็อกอินแล้ว แอปยังค้างที่ Sign in พบข้อจำกัดการเชื่อมต่อในแอป และพบการจำกัดคำขอ GitHub แยกกัน ยังต้องยืนยันรอยต่อ OAuth ด้วยการทดสอบจริง

## ขอบเขตส่วนกลางและรายสตูดิโอ

- เว็บไซต์แจก Launcher และแค็ตตาล็อกมีสคีมาแบบระบุเวอร์ชัน ข้อมูลรายแพ็กเกจประกอบด้วยรหัสแอป ช่องทาง รุ่น แพลตฟอร์ม URL ขนาด และ SHA-256
- Launcher จัดการแพ็กเกจ สถานะติดตั้ง และเปิดแอปด้วยสิทธิ์ผู้ใช้ทั่วไป คลังและแอปที่ติดตั้งแล้วรองรับการใช้เป็นผู้เยี่ยมชม บัญชีใช้สำหรับฟีเจอร์ที่ต้องซิงก์จริง
- แต่ละสตูดิโอมีรหัสคงที่ รูปแบบไฟล์ที่รองรับ ฐานโค้ดต้นทางและ revision คำสั่ง build ข้อจำกัดออนไลน์ เส้นทางเก็บและย้ายข้อมูล และตัวอย่างไฟล์สำหรับทดสอบก่อนปล่อย
- เริ่มที่ meCraft และ meDoc จากนั้น mePDF/mePhoto, meSheet/meDeck แล้วจึงเพิ่มแอปสร้างสรรค์และวิศวกรรมตามผลจริง แอปที่ยังมีเพียงตัวอย่างแสดงสถานะทดลอง

## การคัดเลือกโอเพนซอร์ส

ทุกตัวเลือกเริ่มจากรีโพต้นทางและ revision ที่ตรวจสอบได้ ตรวจไลเซนส์ระดับแอปและ dependency แยกจากไลเซนส์ของรีโพรวม จากนั้นทดสอบงานจริงแบบออฟไลน์ การนำเข้าและเปิดไฟล์เดิม และเวลาในการผสาน เลือกใช้ได้ตั้งแต่ศึกษาวิธีทำ ใช้เฉพาะเอนจิน ไปจนถึงฟอร์กหรือเชื่อมแอปแยก บันทึกเครดิตและขอบเขตการเปลี่ยนแปลงก่อนแจก

## ผลตรวจ The Everything Project

ตรวจพบ 51 โฟลเดอร์ระดับแรกใน `src` ของ revision ที่ตรวจ รวมโฟลเดอร์ทรัพยากรด้วย ตัวเลขจึงบอกขนาดรีโพ ส่วนความพร้อมวัดจาก build และงานรายแอป รีโพหลักระบุ MIT ขณะที่หลายแอปมี LICENSE แบบ AGPL-3.0 ของตัวเอง ผลด้านล่างมาจากซอร์ส เอกสาร และไฟล์ไลเซนส์ต้นทาง ยังไม่ได้ build หรือรันแอป upstream

| เป้าหมาย meCraft | ส่วนที่ควรนำมาทดลอง | ข้อจำกัดและเกณฑ์เลือก |
|---|---|---|
| meDoc | Documents มีเอนจิน canvas, DOCX และ playground แบบ local เป็นตัวเทียบกับ WordCraft และ WriterApp เดิม | README ระบุ MIT ตามไลเซนส์หลัก เว้นส่วนที่ระบุเป็นอย่างอื่น ทดสอบ Sarabun การวางวรรณยุกต์ แบ่งหน้า DOCX เปิดซ้ำ และ PDF ไทย ก่อนเลือกว่าจะใช้เอนจินหรือฟอร์ก [Documents](https://github.com/HeyPuter/everything/tree/d8247a3eeeeb61ad6210e8be7e9ccaeaecfd310c/src/documents) |
| meSheet | Spreadsheet มีโฟลว์เปิดและบันทึก XLSX กับสูตรวันที่และวันทำงาน ใช้เป็นกรณีเทียบกับ GridCraft | AGPL-3.0 และการบันทึกหลักผูก Puter cloud เช็กสูตรไทย วันที่ และนำเข้า–ส่งออก XLSX โดยไม่ใช้บัญชี [Spreadsheet](https://github.com/HeyPuter/everything/tree/d8247a3eeeeb61ad6210e8be7e9ccaeaecfd310c/src/spreadsheet) |
| meDeck | Presentation มีเส้นทางแก้ นำเสนอ และส่งออก PPTX พร้อมพื้นที่ทดสอบ ให้เทียบกับ DeckCraft | AGPL-3.0 ทดสอบฟอนต์ไทย แม่แบบ ภาพ และความคงเดิมหลังเปิดไฟล์กลับ [Presentation](https://github.com/HeyPuter/everything/tree/d8247a3eeeeb61ad6210e8be7e9ccaeaecfd310c/src/presentation) |
| mePDF | ใช้เป็นตัวเทียบเรื่อง local download, rendering และ OCR ชุดเครื่องมือทับกับของเดิมหลายส่วน เช่น pdf-lib, PDF.js | AGPL-3.0 พบ dependency ข้อมูล OCR ภาษาอังกฤษ ทดสอบโมเดลไทยแยก ลองเพิ่มเฉพาะส่วนที่ผลดีกว่า [PDF](https://github.com/HeyPuter/everything/tree/d8247a3eeeeb61ad6210e8be7e9ccaeaecfd310c/src/pdf) |
| meCAD | CAD มีแนวทาง drafting 2D, WebGL2, มิติ และไฟล์ DXF/DWG ใช้เป็นตัวเทียบกับ CADCraft | AGPL-3.0 และใช้ Puter.js สำหรับ backend ทดสอบหน่วย พิกัด และการเปิดซ้ำ โดยเริ่ม DXF เป็นไฟล์อ้างอิง [CAD](https://github.com/HeyPuter/everything/tree/d8247a3eeeeb61ad6210e8be7e9ccaeaecfd310c/src/cad) |
| mePhoto, meVector | Photo Studio มี WebGPU และ WebGL2 fallback, PSD, layers และ masks ส่วน Vector Studio มีคลังกราฟิกและการเก็บการแก้ไขออฟไลน์ | ทั้งคู่ AGPL-3.0 ใช้เทียบความเร็วและคุณภาพ PSD/SVG รวมความเข้ากันได้กับเครื่องที่ไม่มี WebGPU [Photo Studio](https://github.com/HeyPuter/everything/tree/d8247a3eeeeb61ad6210e8be7e9ccaeaecfd310c/src/photo-studio) · [Vector Studio](https://github.com/HeyPuter/everything/tree/d8247a3eeeeb61ad6210e8be7e9ccaeaecfd310c/src/vector-studio) |
| meAudio, meFilm | Audio Studio ใช้ AudioWorklet และแชร์แกนผสมเสียงกับออฟไลน์เรนเดอร์ ใช้เทียบกับ SoundCraft ส่วน Video Studio ใช้เป็นตัวเทียบ workflow กับ FilmCraft | ทั้งคู่ AGPL-3.0 วัดเสียงหลายแทร็ก การตรงกันของภาพและเสียง และเวลาส่งออก [Audio Studio](https://github.com/HeyPuter/everything/tree/d8247a3eeeeb61ad6210e8be7e9ccaeaecfd310c/src/audio-studio) · [Video Studio](https://github.com/HeyPuter/everything/tree/d8247a3eeeeb61ad6210e8be7e9ccaeaecfd310c/src/video-studio) |
| meWhiteboard, me3D | Whiteboard มีการแก้พร้อมกันและกู้การแก้แบบออฟไลน์ ส่วน 3D มีพื้นที่ให้เทียบงาน viewer และแก้โมเดล | ทั้งคู่ AGPL-3.0 ทดสอบงาน local ของเราแยกจาก cloud และตรวจ telemetry ของ Whiteboard ก่อนนำมาพิจารณา [Whiteboard](https://github.com/HeyPuter/everything/tree/d8247a3eeeeb61ad6210e8be7e9ccaeaecfd310c/src/whiteboard) · [3D](https://github.com/HeyPuter/everything/tree/d8247a3eeeeb61ad6210e8be7e9ccaeaecfd310c/src/3d) |
| meForm | Surveys มีการสร้างแบบสอบถาม แชร์ลิงก์ และรวบรวมคำตอบ เทียบกับ Formbricks | ใช้ Puter สำหรับข้อมูลแบบสอบถาม นำมาเทียบใน meForm ส่วน meSurv เป็น GIS/สำรวจพิกัดคนละงาน [Surveys](https://github.com/HeyPuter/everything/tree/d8247a3eeeeb61ad6210e8be7e9ccaeaecfd310c/src/survey) |
| meIDE | API Client เป็นผู้สมัครสำหรับเครื่องมือสร้างและทดสอบคำขอ API ทั่วไป มีชุด unit และ browser test และ README ระบุ cloud sync เป็นทางเลือก | README อ้าง MIT ของรีโพรวมตามเงื่อนไข ตรวจ dependency และทดสอบ local workflow ก่อนย้ายเป็นเครื่องมือใน meIDE ให้เก็บ credential ในเครื่อง [API Client](https://github.com/HeyPuter/everything/tree/d8247a3eeeeb61ad6210e8be7e9ccaeaecfd310c/src/api-client) |

ให้ทดลอง **Documents** และ **API Client** ก่อนหากทดสอบออฟไลน์และเงื่อนไขแจกจ่ายผ่าน ส่วนแอป AGPL ใช้เป็นตัวเทียบความสามารถในรอบนี้ การเลือกฟอร์กเพื่อแจกต้องประเมินข้อกำหนดของรุ่นที่เลือกและต้นทุนเปลี่ยน Puter cloud เป็นระบบของ meCraft สำหรับกลุ่ม email/calendar/teamchat/projects และเครื่องมือธุรกิจ ให้เก็บไว้เป็นผู้สมัครระยะถัดไปตามความต้องการจริง [รีโพต้นทาง](https://github.com/HeyPuter/everything) · [คำอธิบายสัญญาอนุญาต GNU](https://www.gnu.org/licenses/gpl-faq.html)
