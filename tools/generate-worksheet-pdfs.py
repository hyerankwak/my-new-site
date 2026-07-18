from pathlib import Path
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
)


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "pdfs" / "worksheets"
FONT_REGULAR = Path(r"C:\Windows\Fonts\malgun.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\malgunbd.ttf")
TODAY = "2026-06-30"


ITEMS = [
    {
        "slug": "goguryeo-worksheet",
        "title": "고구려 워크지",
        "category": "한국사",
        "intro": "고구려의 넓은 영토, 광개토대왕, 장수왕, 산성과 벽화를 아이 눈높이로 정리합니다.",
        "words": ["고구려", "광개토대왕", "장수왕", "산성", "벽화"],
        "easy": "고구려는 북쪽의 넓은 땅에서 힘을 키운 나라예요. 나라를 지키기 위해 성을 만들고, 왕들은 나라를 더 크게 발전시켰어요.",
        "activities": ["지도에서 북쪽 찾기", "광개토대왕에게 편지 쓰기", "벽화 속 동물 상상해 그리기"],
        "quiz": ["고구려는 한반도의 어느 쪽에서 힘을 키웠나요?", "광개토대왕은 어떤 왕으로 기억되나요?", "산성은 왜 필요했을까요?", "고구려 벽화는 무엇을 알려줄까요?"],
        "writing": "고구려를 한 문장으로 소개해 보세요.",
    },
    {
        "slug": "baekje-worksheet",
        "title": "백제 워크지",
        "category": "한국사",
        "intro": "백제의 문화, 무령왕릉, 바다를 통한 교류를 이야기와 질문으로 익힙니다.",
        "words": ["백제", "무령왕릉", "교류", "문화재", "불교"],
        "easy": "백제는 아름다운 문화를 만들고 다른 나라와도 문화를 주고받은 나라예요. 문화재를 보면 백제 사람들의 생각과 솜씨를 알 수 있어요.",
        "activities": ["문화재 안내판 쓰기", "백제 무늬 꾸미기", "교류가 필요한 이유 말하기"],
        "quiz": ["백제는 어떤 문화로 기억되나요?", "무령왕릉은 무엇을 알려줄까요?", "교류를 하면 어떤 점이 좋을까요?", "문화재를 보존해야 하는 이유는 무엇인가요?"],
        "writing": "백제를 소개하는 전시 안내 문장을 써보세요.",
    },
    {
        "slug": "silla-worksheet",
        "title": "신라 워크지",
        "category": "한국사",
        "intro": "신라와 통일 신라, 화랑, 경주 문화재를 연결해 이해합니다.",
        "words": ["신라", "통일", "화랑", "경주", "불국사"],
        "easy": "신라는 오랜 시간 힘을 기르고 결국 삼국을 통일한 나라예요. 경주에는 신라 사람들이 남긴 문화재가 많이 있어요.",
        "activities": ["경주 문화재 엽서 만들기", "화랑에게 필요한 마음 쓰기", "통일 후 달라진 생활 상상하기"],
        "quiz": ["신라는 어떤 일을 한 나라로 기억되나요?", "화랑에게 필요한 마음은 무엇일까요?", "경주에 신라 유적이 많은 까닭은 무엇일까요?", "문화재를 지켜야 하는 이유는 무엇인가요?"],
        "writing": "신라를 소개하는 제목을 붙여보세요.",
    },
    {
        "slug": "king-sejong-worksheet",
        "title": "세종대왕 워크지",
        "category": "한국사 인물",
        "intro": "세종대왕과 한글 창제, 백성을 생각한 마음을 아이와 이야기합니다.",
        "words": ["세종대왕", "한글", "백성", "자음", "모음"],
        "easy": "세종대왕은 사람들이 쉽게 읽고 쓸 수 있도록 한글을 만든 왕이에요. 우리는 지금도 그 글자를 사용하고 있어요.",
        "activities": ["내 이름의 자음과 모음 찾기", "세종대왕에게 감사 편지 쓰기", "한글이 없었다면 불편했을 일 말하기"],
        "quiz": ["세종대왕은 어떤 글자를 만들었나요?", "한글이 생기면 무엇이 쉬워졌나요?", "자음과 모음은 어떻게 만나 글자가 되나요?", "세종대왕이 백성을 생각했다는 말은 무슨 뜻일까요?"],
        "writing": "세종대왕에게 하고 싶은 말을 써보세요.",
    },
    {
        "slug": "yi-sun-sin-worksheet",
        "title": "이순신 워크지",
        "category": "한국사 인물",
        "intro": "이순신 장군의 용기, 책임감, 거북선 이야기를 질문으로 풀어봅니다.",
        "words": ["이순신", "거북선", "용기", "책임감", "바다"],
        "easy": "이순신 장군은 어려운 상황에서도 바다에서 나라를 지킨 사람이에요. 포기하지 않는 마음으로 기억돼요.",
        "activities": ["거북선 그리기", "용기를 낸 경험 쓰기", "책임감이 필요한 상황 역할놀이"],
        "quiz": ["이순신 장군은 어디에서 나라를 지켰나요?", "거북선은 왜 특별한 배로 알려져 있나요?", "용기와 책임감은 어떻게 다를까요?", "내가 끝까지 해낸 일은 무엇인가요?"],
        "writing": "이순신 장군에게 응원 문장을 써보세요.",
    },
    {
        "slug": "proverb-worksheet",
        "title": "속담 워크지",
        "category": "어휘",
        "intro": "생활 속 상황으로 속담 뜻을 이해하고 짧은 이야기 만들기로 이어갑니다.",
        "words": ["속담", "뜻", "상황", "지혜", "문장"],
        "easy": "속담은 긴 이야기를 짧고 재미있게 말하는 표현이에요. 상황과 함께 익히면 더 오래 기억할 수 있어요.",
        "activities": ["속담 그림 카드 만들기", "오늘 일에 어울리는 속담 찾기", "속담으로 짧은 만화 그리기"],
        "quiz": ["가는 말이 고와야 오는 말이 곱다는 무슨 뜻인가요?", "티끌 모아 태산은 언제 쓸 수 있나요?", "속담을 상황으로 익히면 왜 좋을까요?", "오늘 내 생활에 어울리는 속담은 무엇인가요?"],
        "writing": "새로운 속담을 하나 만들어 보세요.",
    },
    {
        "slug": "four-character-idiom-worksheet",
        "title": "사자성어 워크지",
        "category": "어휘",
        "intro": "사자성어를 뜻 암기보다 상황과 이야기로 익히는 활동지입니다.",
        "words": ["사자성어", "일석이조", "작심삼일", "상황", "표현"],
        "easy": "사자성어는 네 글자로 된 짧은 표현이에요. 어떤 상황에서 쓰는지 알면 글쓰기와 말하기에 도움이 돼요.",
        "activities": ["사자성어 상황 카드 만들기", "오늘 하루를 사자성어로 표현하기", "네 칸 만화로 뜻 설명하기"],
        "quiz": ["일석이조는 어떤 상황에서 쓰나요?", "작심삼일은 어떤 마음을 말하나요?", "사자성어를 상황과 함께 익히면 왜 좋을까요?", "오늘 배운 사자성어로 문장을 만들어 보세요."],
        "writing": "내 하루를 사자성어 하나로 표현해 보세요.",
    },
    {
        "slug": "elementary-reading-worksheet",
        "title": "초등 독해 활동지",
        "category": "독해",
        "intro": "짧은 글을 읽고 중심 문장, 핵심 낱말, 내 생각 쓰기를 연습합니다.",
        "words": ["중심 내용", "핵심 낱말", "제목", "근거", "내 생각"],
        "easy": "독해는 글을 빨리 읽는 것이 아니라 중요한 내용을 찾고 자기 말로 설명하는 일이에요.",
        "activities": ["중심 문장 밑줄 긋기", "처음-가운데-끝 나누기", "내 생각 한 문장 쓰기"],
        "quiz": ["글에서 가장 중요한 문장은 무엇인가요?", "핵심 낱말 세 개를 고르면 무엇인가요?", "글쓴이가 말하고 싶은 것은 무엇인가요?", "이 글에 어울리는 제목은 무엇인가요?"],
        "writing": "읽은 내용을 세 문장으로 줄여 써보세요.",
    },
    {
        "slug": "hangeul-final-consonant-worksheet",
        "title": "한글 받침 워크지",
        "category": "한글",
        "intro": "받침이 있는 낱말을 읽고 쓰며 끝소리를 자연스럽게 익힙니다.",
        "words": ["받침", "끝소리", "강", "집", "손"],
        "easy": "받침은 글자 아래에 붙어서 소리를 끝내주는 친구예요. 천천히 소리 내면 끝소리가 더 잘 들려요.",
        "activities": ["받침 있는 낱말 찾기", "끝소리 천천히 말하기", "받침 낱말로 문장 만들기"],
        "quiz": ["강, 나무, 집 중 받침이 있는 낱말은 무엇인가요?", "'손'의 받침은 어떤 자음인가요?", "받침을 천천히 읽으면 좋은 점은 무엇인가요?", "ㄱ 받침이 들어간 낱말을 써보세요."],
        "writing": "받침이 있는 낱말 세 개로 짧은 문장을 만들어 보세요.",
    },
    {
        "slug": "maze-printable",
        "title": "미로찾기 프린트",
        "category": "놀이자료",
        "intro": "눈과 손의 협응, 방향 감각, 문제 해결력을 연습하는 미로 활동지입니다.",
        "words": ["출발", "도착", "막힌 길", "다시 생각하기", "집중"],
        "easy": "미로에서 막힌 길을 만나도 실패가 아니에요. 다시 돌아가 다른 길을 찾으면 돼요.",
        "activities": ["손가락으로 먼저 길 찾기", "연필로 천천히 선 긋기", "내가 직접 미로 만들기"],
        "quiz": ["막힌 길을 만나면 어떻게 해야 하나요?", "손가락으로 먼저 따라가면 어떤 점이 좋나요?", "미로찾기는 어떤 힘을 길러줄까요?", "끝까지 해낸 뒤 어떤 기분이 드나요?"],
        "writing": "나만의 미로 이야기를 한 문장으로 써보세요.",
        "maze": True,
    },
]


def register_fonts():
    pdfmetrics.registerFont(TTFont("Korean", str(FONT_REGULAR)))
    pdfmetrics.registerFont(TTFont("KoreanBold", str(FONT_BOLD)))


def styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "title",
            parent=base["Title"],
            fontName="KoreanBold",
            fontSize=22,
            leading=28,
            textColor=colors.HexColor("#30242d"),
            alignment=TA_CENTER,
            spaceAfter=8,
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            parent=base["BodyText"],
            fontName="Korean",
            fontSize=10,
            leading=15,
            textColor=colors.HexColor("#786b74"),
            alignment=TA_CENTER,
            spaceAfter=10,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="KoreanBold",
            fontSize=13,
            leading=18,
            textColor=colors.HexColor("#c84479"),
            spaceBefore=8,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["BodyText"],
            fontName="Korean",
            fontSize=10,
            leading=16,
            textColor=colors.HexColor("#30242d"),
        ),
        "small": ParagraphStyle(
            "small",
            parent=base["BodyText"],
            fontName="Korean",
            fontSize=8.5,
            leading=12,
            textColor=colors.HexColor("#786b74"),
        ),
        "box": ParagraphStyle(
            "box",
            parent=base["BodyText"],
            fontName="Korean",
            fontSize=9.5,
            leading=14,
            textColor=colors.HexColor("#514650"),
        ),
    }


def line_table(rows=4, height=12 * mm):
    data = [[""] for _ in range(rows)]
    table = Table(data, colWidths=[170 * mm], rowHeights=[height] * rows)
    table.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#eadde4")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#eadde4")),
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
            ]
        )
    )
    return table


def checklist(items, style):
    data = [[Paragraph(f"□ {item}", style)] for item in items]
    table = Table(data, colWidths=[170 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#fff8fb")),
                ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#f0dce6")),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def word_table(words, style):
    data = [[Paragraph(word, style) for word in words]]
    table = Table(data, colWidths=[34 * mm] * len(words))
    table.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#f0dce6")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#f0dce6")),
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f4fffb")),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def maze_table():
    grid = [
        ["S", "", "■", "", "", "", "■", ""],
        ["■", "", "■", "", "■", "", "■", ""],
        ["", "", "", "", "■", "", "", ""],
        ["", "■", "■", "", "", "■", "■", ""],
        ["", "", "■", "■", "", "", "", ""],
        ["■", "", "", "", "", "■", "", "■"],
        ["", "", "■", "■", "", "", "", ""],
        ["", "■", "", "", "", "■", "■", "G"],
    ]
    data = [[Paragraph(cell, styles()["body"]) for cell in row] for row in grid]
    table = Table(data, colWidths=[18 * mm] * 8, rowHeights=[14 * mm] * 8)
    commands = [
        ("GRID", (0, 0), (-1, -1), 0.6, colors.HexColor("#d9cbd2")),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("FONTNAME", (0, 0), (-1, -1), "KoreanBold"),
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
    ]
    for y, row in enumerate(grid):
        for x, cell in enumerate(row):
            if cell == "■":
                commands.append(("BACKGROUND", (x, y), (x, y), colors.HexColor("#514650")))
                commands.append(("TEXTCOLOR", (x, y), (x, y), colors.HexColor("#514650")))
            if cell in {"S", "G"}:
                commands.append(("BACKGROUND", (x, y), (x, y), colors.HexColor("#fff0f6")))
                commands.append(("TEXTCOLOR", (x, y), (x, y), colors.HexColor("#c84479")))
    table.setStyle(TableStyle(commands))
    return table


def footer_canvas(canvas, doc):
    canvas.saveState()
    canvas.setFont("Korean", 8)
    canvas.setFillColor(colors.HexColor("#786b74"))
    canvas.drawString(18 * mm, 12 * mm, "ToyPoppo 엄마표 자료실")
    canvas.drawRightString(192 * mm, 12 * mm, f"{doc.page}쪽")
    canvas.restoreState()


def build_pdf(item):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    file_path = OUT_DIR / f"{item['slug']}.pdf"
    s = styles()
    doc = SimpleDocTemplate(
        str(file_path),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=18 * mm,
        title=item["title"],
        author="ToyPoppo",
    )
    story = []
    story.append(Paragraph(item["title"], s["title"]))
    story.append(Paragraph(str(item["category"]), s["subtitle"]))
    story.append(Paragraph(item["intro"], s["body"]))
    story.append(Spacer(1, 5 * mm))
    story.append(Paragraph("부모가 먼저 읽어주세요", s["h2"]))
    story.append(Paragraph(item["easy"], s["body"]))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("핵심 낱말", s["h2"]))
    story.append(word_table(item["words"], s["box"]))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("오늘 해볼 활동", s["h2"]))
    story.append(checklist(item["activities"], s["box"]))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("생각 퀴즈", s["h2"]))
    for idx, question in enumerate(item["quiz"], 1):
        story.append(Paragraph(f"{idx}. {question}", s["body"]))
        story.append(line_table(1, 10 * mm))
        story.append(Spacer(1, 2 * mm))
    story.append(PageBreak())
    story.append(Paragraph("내 생각을 써봐요", s["h2"]))
    story.append(Paragraph(item["writing"], s["body"]))
    story.append(line_table(4, 12 * mm))
    story.append(Spacer(1, 5 * mm))
    if item.get("maze"):
        story.append(Paragraph("미로찾기", s["h2"]))
        story.append(Paragraph("S에서 출발해 G까지 선을 이어보세요. 막힌 길을 만나면 다시 돌아가도 괜찮아요.", s["body"]))
        story.append(Spacer(1, 3 * mm))
        story.append(maze_table())
        story.append(Spacer(1, 5 * mm))
    story.append(Paragraph("부모 활용 메모", s["h2"]))
    story.append(Paragraph("아이가 어려워한 부분, 재미있어한 부분, 다음에 다시 해볼 질문을 적어두세요.", s["small"]))
    story.append(line_table(4, 12 * mm))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("마무리 질문", s["h2"]))
    story.append(checklist(["오늘 새로 알게 된 것 한 가지 말하기", "가장 재미있었던 문제 고르기", "다음에 더 알고 싶은 것 말하기"], s["box"]))
    doc.build(story, onFirstPage=footer_canvas, onLaterPages=footer_canvas)
    return file_path


def update_html_links():
    for item in ITEMS:
        html_path = ROOT / "worksheets" / f"{item['slug']}.html"
        html = html_path.read_text(encoding="utf-8")
        pdf_url = f"/assets/pdfs/worksheets/{item['slug']}.pdf"
        html = re.sub(
            r'<a class="button primary" href="#" aria-disabled="true">PDF 다운로드 준비 중</a>',
            f'<a class="button primary" href="{pdf_url}" download>PDF 다운로드</a>',
            html,
        )
        html = html.replace("인쇄용 PDF는 자료 구성과 가독성을 점검한 뒤 순차적으로 연결합니다. 현재는 부모 활용법과 활동 예시를 먼저 공개하며, PDF가 연결되면 같은 페이지에서 내려받을 수 있게 업데이트합니다.",
                            "인쇄용 PDF를 내려받아 사용할 수 있습니다. 출력 전에는 아래 안내를 읽고, 아이 수준에 맞춰 문제 수를 조절해 주세요.")
        html_path.write_text(html, encoding="utf-8")


def main():
    register_fonts()
    made = [build_pdf(item) for item in ITEMS]
    update_html_links()
    for pdf in made:
        print(pdf.relative_to(ROOT))


if __name__ == "__main__":
    main()
