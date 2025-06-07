function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)

    const SPREADSHEET_ID = "1xbaeCm5ywOXOmZjXWJ_cYLiQ57YvznrOGIh5mBzFyg8"
    const SHEET_NAME = "ТЕСТ" // ❗ Укажи имя листа здесь

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME)

    if (!sheet) {
      throw new Error(`Лист с именем "${SHEET_NAME}" не найден.`)
    }

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 10).setValues([
        [
          "Дата и время",
          "Телефон",
          "Общий балл",
          "Общий %",
          "Видео",
          "Грамматика",
          "Перевод",
          "Письмо",
          "Детальные ответы",
          "IP адрес",
        ],
      ])
    }

    sheet.appendRow([
      data.timestamp,
      data.phone,
      data.totalScore,
      data.totalPercentage + "%",
      data.videoScore,
      data.grammarScore,
      data.translationScore,
      data.writingScore,
      data.detailedAnswers,
      e.parameter.userip || "Unknown",
    ])

    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: error.toString(),
        }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}


function testFunction() {
  const testData = {
    timestamp: new Date().toISOString(),
    phone: "+7 999 123 45 67",
    totalScore: "6/8",
    totalPercentage: 75,
    videoScore: "2/2",
    grammarScore: "1/2",
    translationScore: "2/2",
    writingScore: "1/2",
    detailedAnswers: '{"1":0,"2":1,"3":0,"4":2}',
  }

  console.log("Test data:", testData)
}
