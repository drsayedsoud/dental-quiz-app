const fs = require('fs');

// Fix login/page.tsx
let login = fs.readFileSync('src/app/login/page.tsx', 'utf8');
login = login.replace(/Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ø£Ùˆ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± ØºÙŠØ± ØµØ­ÙŠØ­Ø©/g, 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
login = login.replace(/ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± ØºÙŠØ± ØµØ­ÙŠØ­Ø©/g, 'كلمة المرور غير صحيحة');
login = login.replace(/Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„(?!')/g, 'حدث خطأ أثناء تسجيل الدخول');
login = login.replace(/Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø¨Ù€ Google/g, 'حدث خطأ أثناء تسجيل الدخول بـ Google');
login = login.replace(/ðŸ¦·/g, '🦷');
login = login.replace(/ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„/g, 'تسجيل الدخول');
login = login.replace(/Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ ÙÙŠ Prometric Dent/g, 'مرحباً بك في Prometric Dent');
login = login.replace(/Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ/g, 'البريد الإلكتروني');
login = login.replace(/ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±/g, 'كلمة المرور');
login = login.replace(/â³ Ø¬Ø§Ø±Ù Ø§Ù„Ø¯Ø®ÙˆÙ„\.\.\./g, '⏳ جارٍ الدخول...');
login = login.replace(/Ø¯Ø®ÙˆÙ„/g, 'دخول');
login = login.replace(/Ø£Ùˆ/g, 'أو');
login = login.replace(/Ø³Ø¬Ù„ Ø¨Ø­Ø³Ø§Ø¨ Google/g, 'سجل بحساب Google');
login = login.replace(/Ù„ÙŠØ³ Ù„Ø¯ÙŠÙƒ Ø­Ø³Ø§Ø¨ØŸ/g, 'ليس لديك حساب؟');
login = login.replace(/Ø³Ø¬Ù„ Ø§Ù„Ø¢Ù†/g, 'سجل الآن');
fs.writeFileSync('src/app/login/page.tsx', login, 'utf8');
console.log('Fixed login/page.tsx');

// Fix signup/page.tsx
let signup = fs.readFileSync('src/app/signup/page.tsx', 'utf8');
signup = signup.replace(/ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± ÙŠØ¬Ø¨ Ø£Ù† ØªÙƒÙˆÙ† 6 Ø£Ø­Ø±Ù Ø¹Ù„Ù‰ Ø§Ù„Ø£Ù‚Ù„/g, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
signup = signup.replace(/ÙƒÙ„Ù…Ø§Øª Ø§Ù„Ù…Ø±ÙˆØ± ØºÙŠØ± Ù…ØªØ·Ø§Ø¨Ù‚Ø©/g, 'كلمات المرور غير متطابقة');
signup = signup.replace(/Ù‡Ø°Ø§ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ù…Ø³Ø¬Ù„ Ø¨Ø§Ù„ÙØ¹Ù„/g, 'هذا البريد الإلكتروني مسجل بالفعل');
signup = signup.replace(/Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ ØºÙŠØ± ØµØ§Ù„Ø­/g, 'البريد الإلكتروني غير صالح');
signup = signup.replace(/Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø­Ø³Ø§Ø¨/g, 'حدث خطأ أثناء إنشاء الحساب');
// Fix all remaining garbled Arabic in signup
signup = signup.replace(/Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø¨Ù€ Google/g, 'حدث خطأ أثناء تسجيل الدخول بـ Google');
signup = signup.replace(/ðŸ¦·/g, '🦷');
signup = signup.replace(/Ø¥Ù†Ø´Ø§Ø¡ Ø­Ø³Ø§Ø¨ Ø¬Ø¯ÙŠØ¯/g, 'إنشاء حساب جديد');
signup = signup.replace(/Ø§Ù†Ø¶Ù… Ø¥Ù„Ù‰ Prometric Dent/g, 'انضم إلى Prometric Dent');
signup = signup.replace(/Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ/g, 'البريد الإلكتروني');
signup = signup.replace(/ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±/g, 'كلمة المرور');
signup = signup.replace(/ØªØ£ÙƒÙŠØ¯ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±/g, 'تأكيد كلمة المرور');
signup = signup.replace(/â³ Ø¬Ø§Ø±Ù Ø§Ù„ØªØ³Ø¬ÙŠÙ„\.\.\./g, '⏳ جارٍ التسجيل...');
signup = signup.replace(/ØªØ³Ø¬ÙŠÙ„/g, 'تسجيل');
signup = signup.replace(/Ø£Ùˆ/g, 'أو');
signup = signup.replace(/Ø³Ø¬Ù„ Ø¨Ø­Ø³Ø§Ø¨ Google/g, 'سجل بحساب Google');
signup = signup.replace(/Ù„Ø¯ÙŠÙƒ Ø­Ø³Ø§Ø¨ Ø¨Ø§Ù„ÙØ¹Ù„ØŸ/g, 'لديك حساب بالفعل؟');
signup = signup.replace(/Ø³Ø¬Ù„ Ø¯Ø®ÙˆÙ„/g, 'سجل دخول');
fs.writeFileSync('src/app/signup/page.tsx', signup, 'utf8');
console.log('Fixed signup/page.tsx');
