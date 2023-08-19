package com.subproblem.chatapplication.message;


import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ChatMessage {

    private String content;
    private String sender;
    private MessageType type;

}
