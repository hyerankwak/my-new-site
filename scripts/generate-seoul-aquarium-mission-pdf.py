from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
root=Path(__file__).resolve().parents[1]; out=root/"assets/pdfs/places/seoul-lotteworld-aquarium-observation-mission.pdf"; out.parent.mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(TTFont("Malgun","C:/Windows/Fonts/malgun.ttf")); pdfmetrics.registerFont(TTFont("Malgun-Bold","C:/Windows/Fonts/malgunbd.ttf"))
navy,blue,pale,line=map(colors.HexColor,["#123B5D","#1786A8","#EAF8FB","#A9DCE8"])
title=ParagraphStyle("title",fontName="Malgun-Bold",fontSize=21,leading=27,textColor=navy,spaceAfter=6); sub=ParagraphStyle("sub",fontName="Malgun",fontSize=9.5,leading=14,textColor=colors.HexColor("#506675"),spaceAfter=10); h2=ParagraphStyle("h2",fontName="Malgun-Bold",fontSize=12,leading=17,textColor=blue,spaceBefore=6,spaceAfter=5); body=ParagraphStyle("body",fontName="Malgun",fontSize=9.3,leading=13.5,textColor=navy)
def box(label,height=22*mm):
 t=Table([[Paragraph(label,body)],[""]],colWidths=[174*mm],rowHeights=[8*mm,height]); t.setStyle(TableStyle([("BOX",(0,0),(-1,-1),.8,line),("BACKGROUND",(0,0),(0,0),pale),("LEFTPADDING",(0,0),(-1,-1),7),("TOPPADDING",(0,0),(-1,-1),4)])); return t
def footer(canvas,doc):
 canvas.saveState(); canvas.setFont("Malgun",8); canvas.setFillColor(colors.HexColor("#667985")); canvas.drawString(18*mm,10*mm,"ToyPoppo 해양생물 관찰 미션카드"); canvas.drawRightString(192*mm,10*mm,"toypoppo.kr"); canvas.restoreState()
doc=SimpleDocTemplate(str(out),pagesize=A4,leftMargin=18*mm,rightMargin=18*mm,topMargin=15*mm,bottomMargin=15*mm)
story=[Paragraph("서울 아쿠아리움 관찰 미션카드",title),Paragraph("현장에서 다 채우려 하지 말고, 아이가 고른 생물 세 종만 천천히 관찰하세요.",sub),Paragraph("1. 오늘 찾을 세 가지",h2)]
missions=[[Paragraph("□ 수면 가까이에서 움직이는 생물 한 종",body)],[Paragraph("□ 수조 가운데에서 무리 지어 움직이는 생물 한 종",body)],[Paragraph("□ 바닥 가까이에서 쉬거나 움직이는 생물 한 종",body)],[Paragraph("□ 몸이 납작한 생물과 길쭉한 생물 비교하기",body)],[Paragraph("□ 바다를 지키기 위해 내가 할 행동 한 가지",body)]]
t=Table(missions,colWidths=[174*mm]); t.setStyle(TableStyle([("BOX",(0,0),(-1,-1),.8,line),("INNERGRID",(0,0),(-1,-1),.5,line),("LEFTPADDING",(0,0),(-1,-1),7),("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5)])); story += [t,Spacer(1,6),Paragraph("2. 생물 한 종을 깊게 보기",h2),box("이름을 모르더라도 괜찮아요. 몸 모양과 색을 그려 보세요.",25*mm),Spacer(1,5),box("수조의 위·가운데·바닥 중 어디에 있었나요? 어떻게 움직였나요?",19*mm),Spacer(1,5),box("그 몸 모양이 생활에 어떤 도움을 줄까요? 아이의 추측을 적어 보세요.",19*mm),Paragraph("3. 가족 하브루타",h2)]
qs=[[Paragraph("물고기가 떼로 다니면 어떤 점이 좋을까?",body),Paragraph("상어가 사라지면 바다는 어떻게 달라질까?",body)],[Paragraph("가오리와 상어의 움직임은 왜 다를까?",body),Paragraph("플라스틱이 바다에 가면 누구에게 닿을까?",body)],[Paragraph("내가 수조를 만든다면 숨을 곳은 어디에 둘까?",body),Paragraph("오늘 지키고 싶은 생물 한 종은 무엇일까?",body)]]
q=Table(qs,colWidths=[87*mm,87*mm]); q.setStyle(TableStyle([("BOX",(0,0),(-1,-1),.8,line),("INNERGRID",(0,0),(-1,-1),.5,line),("BACKGROUND",(0,0),(-1,-1),pale),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),7),("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6)])); story += [q,Paragraph("4. 집에 와서",h2),box("관찰한 사실은 파란색, 내 생각은 주황색으로 써 보세요. 다른 기준으로 다시 분류해도 좋아요.",17*mm)]
doc.build(story,onFirstPage=footer,onLaterPages=footer); print(out)
